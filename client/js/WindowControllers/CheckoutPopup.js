import Popup from "./Popup.js";

export default class CheckoutPopup extends Popup {
  // Customizable variables
  clamps = ["px:150", "vh:100"];
  defaultClamp = "px:150";

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick(e) {
    if (this.inTransition) return;
    this.currentClamp = 0;
    this.smoothResize();
  }

  cartUpdated() {
    this.element.querySelector(".cart").innerHTML = `<h1>${
      this.controller.cart.length
    } ${this.controller.cart.length > 1 ? "items" : "item"}</h1>`;
  }
}
