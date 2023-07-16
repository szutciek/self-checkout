import MainWindow from "./WindowControllers/Main.js";
import ItemPopup from "./WindowControllers/ItemPopup.js";
import LoginPopup from "./WindowControllers/LoginPopup.js";
import CheckoutPopup from "./WindowControllers/CheckoutPopup.js";

export default class ClientController {
  constructor() {
    this.mainWindow = new MainWindow("mainElement");
    this.itemPopup = new ItemPopup("itemPopupElement");
    this.loginPopup = new LoginPopup("loginPopupElement");
    this.checkoutPopup = new CheckoutPopup("checkoutPopupElement");
  }

  setup() {
    return new Promise(async (res, rej) => {
      try {
        await this.getMenuItems();
        this.updateMenu();

        res();
      } catch (err) {
        rej(err);
      }
    });
  }

  async getMenuItems() {
    console.log("Getting menu items");
  }

  updateMenu() {
    console.log("sending request");
  }
}
