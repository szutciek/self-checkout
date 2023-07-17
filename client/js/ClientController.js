import config from "./config.js";

import MainWindow from "./WindowControllers/Main.js";
import ItemPopup from "./WindowControllers/ItemPopup.js";
import LoginPopup from "./WindowControllers/LoginPopup.js";
import CheckoutPopup from "./WindowControllers/CheckoutPopup.js";
import LockWindow from "./WindowControllers/Lock.js";

export default class ClientController {
  #step = 0;

  #lang = "en";

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

        res();
      } catch (err) {
        rej(err);
      }
    });
  }

  async getMenuItems() {
    try {
      const res = await fetch(`${config.apiBaseUrl}/menu`);
      if (!res.ok) throw new Error("Failed to get menu items");
      const data = await res.json();
      if (!data) throw new Error("Failed to parse menu items");
      this.menu = data;
    } catch (err) {
      console.warn(err.message);
    }
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
    console.log("Language changed to", this.lang);
    this.mainWindow.handleLanguageChange(this.lang);
    this.lockWindow.handleLanguageChange(this.lang);
  }
}
