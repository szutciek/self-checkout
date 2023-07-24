import config from "./config.js";

import MainWindow from "./WindowControllers/Main.js";
import ItemPopup from "./WindowControllers/ItemPopup.js";
import LoginPopup from "./WindowControllers/LoginPopup.js";
import CheckoutPopup from "./WindowControllers/CheckoutPopup.js";
import LockWindow from "./WindowControllers/Lock.js";

export default class ClientController {
  #step = 0;
  #lang = "en";
  #user = null;
  #cart = [];

  #menu = [];

  #stationId = null;
  #ws = undefined;
  #supportedLanguages = ["en", "pl"];

  constructor() {
    this.mainWindow = new MainWindow("mainElement", this);
    this.itemPopup = new ItemPopup("itemPopupElement", this);
    this.loginPopup = new LoginPopup("loginPopupElement", this);
    this.checkoutPopup = new CheckoutPopup("checkoutPopupElement", this);
    this.lockWindow = new LockWindow("lockElement", this);
    this.popups = [this.itemPopup, this.checkoutPopup, this.loginPopup];
    this.windows = [...this.popups, this.mainWindow, this.lockWindow];
  }

  setup() {
    return new Promise(async (res, rej) => {
      try {
        // this.lockWindow.show();
        this.connectSocket();
        this.addSocketListeners();
        this.#stationId = await this.getStationId();
        console.log(`Station assigned id ${this.#stationId}`);
        await this.getIngredientInfo();
        await this.getMenuItems();
        this.updateMenu();
        this.mainWindow.show();
        this.checkoutPopup.show();

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
      const data = await res.json();
      if (!data) throw new Error("Failed to parse ingredient info");
      this.ingredients = data.ingredients;
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
      this.#menu = data.menu;
      this.#supportedLanguages.forEach((lang) => {
        this.replaceIngredientsData(this.#menu[lang], lang);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  connectSocket() {
    return new Promise(async (res, rej) => {
      try {
        this.#ws = new WebSocket(config.wsUrl);
        this.#ws.onopen = () => {
          this.#ws.send(JSON.stringify({ type: "registerstation" }));
          res();
        };
      } catch (err) {
        rej(err);
      }
    });
  }

  getStationId() {
    return new Promise(async (res, rej) => {
      try {
        const awaitId = (e) => {
          const message = JSON.parse(e.data);
          if (message.type === "stationid") {
            this.#ws.removeEventListener("message", awaitId);
            res(message.id);
          }
        };
        this.#ws.addEventListener("message", awaitId);
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

  replaceIngredientsData(menu, language) {
    menu.forEach((item) => {
      item.ingredients = item.ingredients.map(
        (ingredient) => this.ingredients[language][ingredient]
      );
    });
  }

  showLogin() {
    this.loginPopup.show();
  }

  cancelOrder() {
    this.popups.forEach((p) => p.hide());
    this.#step = 0;
    this.#lang = "en";
    this.#user = null;
    this.#cart = [];
    this.lockWindow.show();
  }

  popupShown(elementId) {
    if (elementId !== this.checkoutPopup.elementId) this.checkoutPopup.hide();
  }

  popupHidden(elementId) {
    let allHidden = true;
    this.popups.forEach((p) => {
      if (p.visible === true) allHidden = false;
    });
    if (allHidden === true) this.checkoutPopup.show();
  }

  getProductById(id) {
    const prod = this.#menu[this.#lang].find((p) => p.id === id);
    return prod || {};
  }

  updateMenu() {
    const currentMenu = this.#menu[this.#lang];
    this.mainWindow.updateMenu(currentMenu);
  }

  startOrder() {
    if (this.#step === 0 && this.mainWindow.prepared === true) {
      this.#step = 1;
      this.lockWindow.hide();
    }
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
  }

  addToCart(item) {
    this.#cart.push(item);
    this.checkoutPopup.cartUpdated();
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

  get stationId() {
    return this.#stationId;
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
}
