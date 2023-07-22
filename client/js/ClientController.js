import config from "./config.js";
import { ingredientInfo, menu as tempMenuString } from "./tempData.js";

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
  #stationId = null;

  constructor() {
    this.mainWindow = new MainWindow("mainElement", this);
    this.itemPopup = new ItemPopup("itemPopupElement", this);
    this.loginPopup = new LoginPopup("loginPopupElement", this);
    this.checkoutPopup = new CheckoutPopup("checkoutPopupElement", this);
    this.lockWindow = new LockWindow("lockElement", this);
    this.popups = [this.itemPopup, this.checkoutPopup, this.loginPopup];
    this.windows = [...this.popups, this.mainWindow, this.lockWindow];
    this.#stationId = crypto.randomUUID();
  }

  setup() {
    return new Promise(async (res, rej) => {
      try {
        this.lockWindow.show();
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

  async getMenuItems() {
    try {
      // const res = await fetch(`${config.apiBaseUrl}/menu`);
      // if (!res.ok) throw new Error("Failed to get menu items");
      // const data = await res.json();
      const data = JSON.parse(tempMenuString);
      if (!data) throw new Error("Failed to parse menu items");
      this.replaceIngredientsData(data);
      this.menu = data;
    } catch (err) {
      console.warn(err.message);
    }
  }

  replaceIngredientsData(menu) {
    menu.forEach((item) => {
      item.ingredients = item.ingredients.map(
        (ingredient) => ingredientInfo[ingredient]
      );
    });
  }

  showLogin() {
    this.loginPopup.show();

    // temporary solution
    setTimeout(() => {
      this.user = {
        name: "John Doe",
      };
      this.loginPopup.hide();
    }, 2.5 * 1000);
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

  updateMenu() {
    this.mainWindow.updateMenu(this.menu);
  }

  startOrder() {
    if (this.#step === 0 && this.mainWindow.prepared === true) {
      this.#step = 1;
      this.lockWindow.hide();
    }
  }

  handleChangeLanguage() {
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
}
