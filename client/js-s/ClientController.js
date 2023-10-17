import config from "./config.js";

import Menu from "./Menu.js";
import Cart from "./Cart.js";
import MainWindow from "./WindowControllers/Main.js";
import ItemPopup from "./WindowControllers/ItemPopup.js";
import ServerPopup from "./WindowControllers/ServerPopup.js";
import LoginPopup from "./WindowControllers/LoginPopup.js";
import CheckoutPopup from "./WindowControllers/CheckoutPopup.js";
import LockWindow from "./WindowControllers/Lock.js";

export default class ClientController {
  #step = 0;
  #lang = "en";
  #user = null;
  #allowUnlock = false;

  #menu = undefined;
  #cart = undefined;

  #sessionId = null;
  #ws = undefined;
  #supportedLanguages = ["en", "pl"];

  constructor() {
    this.mainWindow = new MainWindow("mainElement", this);
    this.itemPopup = new ItemPopup("itemPopupElement", this);
    this.serverPopup = new ServerPopup("serverPopupElement", this);
    this.loginPopup = new LoginPopup("loginPopupElement", this);
    this.checkoutPopup = new CheckoutPopup("checkoutPopupElement", this);
    this.lockWindow = new LockWindow("lockElement", this);
    this.popups = [
      this.itemPopup,
      this.checkoutPopup,
      this.loginPopup,
      this.serverPopup,
    ];
    this.windows = [...this.popups, this.mainWindow, this.lockWindow];
  }

  setup() {
    return new Promise(async (res, rej) => {
      try {
        this.lockWindow.show();
        await this.connectSocket();
        await this.requestRegistration();
        this.addSocketListeners();
        this.#sessionId = await this.getSessionId();
        const ingredients = await this.getIngredientInfo();
        const menu = await this.getMenuItems();
        this.#cart = new Cart(this);
        this.#menu = new Menu(menu, ingredients, this);
        this.handleChangeLanguage();
        this.mainWindow.show();
        this.checkoutPopup.show();
        this.#allowUnlock = true;

        res();
      } catch (err) {
        document.body.innerText = "Failed to setup client";
        rej(err);
      }
    });
  }

  restartStation() {
    return new Promise(async (res, rej) => {
      try {
        this.#allowUnlock = false;
        this.#sessionId = await this.getSessionId();
        this.#cart = new Cart(this);
        this.#step = 0;
        this.#lang = "en";
        this.#user = null;
        this.#allowUnlock = true;

        res();
      } catch (err) {
        rej(err);
      }
    });
  }

  async getIngredientInfo() {
    try {
      const res = await fetch(`${config.apiBaseUrl}/ingredients`);
      if (!res.ok) throw new Error("Failed to get ingredient info");
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let data = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        data += value;
      }
      const parsed = await JSON.parse(data);
      return parsed;
    } catch (err) {
      console.warn(err.message);
    }
  }

  async getMenuItems() {
    try {
      const res = await fetch(`${config.apiBaseUrl}/menu`);
      if (!res.ok) throw new Error("Failed to get menu items");
      const data = await res.json();
      if (!data) throw new Error("Failed to parse menu items");
      const menu = data.menu;
      return menu;
    } catch (err) {
      console.warn(err);
    }
  }

  async handleConnectionClose() {
    try {
      this.popups.forEach((w) => w.hide());
      this.serverPopup.showLoading("Connection to server lost. Reconnecting");
      await this.connectSocket();
      await this.requestRegistration();
      this.#sessionId = await this.getSessionId();
      this.serverPopup.hide();
    } catch (err) {
      this.serverPopup.showError(`Failed to connect to server.`);
    }
  }

  connectSocket() {
    return new Promise(async (res, rej) => {
      try {
        this.#ws = new WebSocket(config.wsUrl);
        this.#ws.addEventListener("close", () => this.handleConnectionClose());
        this.#ws.addEventListener("open", () => res());
      } catch (err) {
        rej(err);
      }
    });
  }

  requestRegistration() {
    return new Promise((res, rej) => {
      if (this.#ws.readyState !== WebSocket.OPEN)
        return rej("Connection to server lost. Please restart station.");
      this.#ws.send(JSON.stringify({ type: "registerstation" }));
      res();
    });
  }

  getSessionId() {
    return new Promise(async (res, rej) => {
      try {
        const awaitId = (e) => {
          const message = JSON.parse(e.data);
          if (message.type !== "sessionId") return;
          this.#ws.removeEventListener("message", awaitId);
          res(message.id);
        };
        this.#ws.addEventListener("message", awaitId);
        this.#ws.send(JSON.stringify({ type: "assignSessionId" }));
      } catch (err) {
        rej(err);
      }
    });
  }

  addSocketListeners() {
    this.#ws.addEventListener("message", this.handleWSMessage);
  }

  handleWSMessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "userAuthorized") {
      this.user = message.user;
      this.loginPopup.hide();
    }
  };

  showLogin() {
    if (this.allowPopup === false) return;
    this.loginPopup.show();
  }

  showItem(product, item, zooming) {
    if (this.allowPopup === false) return;
    this.itemPopup.showItem(product, item, zooming);
  }

  cancelOrder() {
    this.popups.forEach((p) => p.hide());
    this.lockWindow.show();
    this.restartStation();
  }

  popupShown(elementId) {
    if (elementId !== this.checkoutPopup.elementId) this.checkoutPopup.hide();
  }

  popupHidden(elementId) {
    if (this.allowPopup === false) return;
    let allHidden = true;
    this.popups.forEach((p) => {
      if (p.visible === true) allHidden = false;
    });
    if (allHidden === true) this.checkoutPopup.show();
  }

  getProductById(id, returnDifferentLanguage) {
    this.menu.getProductById(id, returnDifferentLanguage);
  }

  updateMenu() {
    this.mainWindow.updateMenu(this.#menu.currentMenu);
  }

  startOrder() {
    if (this.#step === 0 && this.mainWindow.prepared === true) {
      this.#step = 1;
      this.lockWindow.hide();
    }
  }

  cartUpdated() {
    this.checkoutPopup.updateCart();
  }

  confirmOrder() {
    return new Promise(async (res, rej) => {
      try {
        const cartData = this.cart.checkoutData;
        await this.awaitOrderConfirmation(cartData);
        this.serverPopup.showSuccess("Order accepted. Thank you!");
      } catch (err) {
        this.serverPopup.showError(err);
      }
    });
  }

  awaitOrderConfirmation(cart) {
    return new Promise(async (res, rej) => {
      if (this.#ws.readyState === WebSocket.CLOSED)
        return rej("Connection to server lost. Please restart station.");

      const awaitOrder = (e) => {
        const message = JSON.parse(e.data);
        if (message.type === "orderAccepted") {
          res();
        }
        if (message.type === "orderWarning") {
          rej("Server returned warning!");
        }
        if (message.type === "orderFailure") {
          rej(message.message);
        }
        this.#ws.removeEventListener("message", awaitOrder);
      };
      this.#ws.addEventListener("message", awaitOrder);
      this.#ws.addEventListener("close", () =>
        rej("Connection to server lost. Please restart station.")
      );
      this.serverPopup.showLoading("Processing your order");
      this.#ws.send(JSON.stringify({ type: "order", cart }));
    });
  }

  handleChangeLanguage() {
    this.updateMenu();
    this.windows.forEach((w) => w.handleLanguageChange(this.lang));
  }

  handleClick(e) {
    if (!e.target.closest("#mainElement"))
      this.mainWindow.handleOutsideClick(e);
    if (!e.target.closest("#itemPopupElement"))
      this.itemPopup.handleOutsideClick(e);
    if (!e.target.closest("#checkoutPopupElement"))
      this.checkoutPopup.handleOutsideClick(e);
    if (!e.target.closest("#loginPopupElement"))
      this.loginPopup.handleOutsideClick(e);
    if (!e.target.closest("#serverPopupElement"))
      this.serverPopup.handleOutsideClick(e);
  }

  redirectUser(target) {
    this.#ws.send(JSON.stringify({ type: "redirectUser", target }));
  }

  fillProductInfo(product) {
    const full = this.getProductById(product.id, true);
    if (!full)
      return {
        name: "Product Not Found",
        size: { name: "", size: "" },
        price: 0,
      };
    if (product.size) {
      full.size = full.sizes[product.size];
      full.price = full.size.price;
    }
    return full;
  }

  get cart() {
    return this.#cart;
  }

  get lang() {
    return this.#lang;
  }
  set lang(lang) {
    if (lang.length !== 2) throw new Error("Invalid language code");
    lang = lang.toLowerCase();
    if (lang !== this.#lang) {
      this.#lang = lang;
      this.handleChangeLanguage();
    }
  }

  get sessionId() {
    return this.#sessionId;
  }

  set user(value) {
    this.#user = value;
    this.windows.forEach((w) => w.handleUserChange(this.#user));
  }
  get user() {
    return this.#user;
  }

  get menu() {
    return this.#menu;
  }

  get allowUnlock() {
    return this.#allowUnlock;
  }

  get supportedLanguages() {
    return this.#supportedLanguages;
  }

  get allowPopup() {
    return this.serverPopup.visible === false;
  }
}
