import Popup from "./Popup.js";

export default class LoginPopup extends Popup {
  // Customizable variables
  clamps = ["vh:50"];
  defaultClamp = "vh:50";
  userDraggable = false;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick() {
    if (this.visible && !this.inTransition) this.hide();
  }
}
