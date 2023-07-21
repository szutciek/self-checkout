import Popup from "./Popup.js";

export default class LoginPopup extends Popup {
  // Customizable variables
  clamps = ["px:180", "vh:100"];
  defaultClamp = "vh:100";
  userDraggable = false;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }
}
