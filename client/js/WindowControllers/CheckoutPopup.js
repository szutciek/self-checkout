import Popup from "./Popup.js";

export default class CheckoutPopup extends Popup {
  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
    this.handleCreation();
  }

  handleCreation() {
    this.element.style.transition = "0.5s ease-in-out";
  }
}
