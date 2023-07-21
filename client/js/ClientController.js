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

  #cart = [];

  constructor() {
    this.mainWindow = new MainWindow("mainElement", this);
    this.itemPopup = new ItemPopup("itemPopupElement", this);
    this.loginPopup = new LoginPopup("loginPopupElement", this);
    this.checkoutPopup = new CheckoutPopup("checkoutPopupElement", this);
    this.lockWindow = new LockWindow("lockElement", this);
  }

  setup() {
    return new Promise(async (res, rej) => {
      try {
        // this.lockWindow.show();
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

  popupShown(elementId) {
    this.checkoutPopup.hide();
  }

  popupHidden(elementId) {
    this.checkoutPopup.show();
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

  handleChangeLanguage() {
    this.mainWindow.handleLanguageChange(this.lang);
    this.lockWindow.handleLanguageChange(this.lang);
  }

  handleClick(e) {
    if (!e.target.closest(".main")) this.mainWindow.handleOutsideClick(e);
    if (!e.target.closest(".itemPopup")) this.itemPopup.handleOutsideClick(e);
  }

  addToCart(item) {
    this.#cart.push(item);
    this.checkoutPopup.cartUpdated();
  }
  get cart() {
    return this.#cart;
  }
}
