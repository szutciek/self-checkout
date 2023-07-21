import config from "../config.js";

import Popup from "./Popup.js";

export default class LoginPopup extends Popup {
  // Customizable variables
  clamps = ["px:382.5"];
  defaultClamp = "px:382.5";
  userDraggable = false;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick() {
    if (this.visible && !this.inTransition) this.hide();
  }

  showSpecific() {
    this.insertContent();
  }

  insertContent() {
    const parent = this.element.querySelector(".codeBackground");
    parent.innerHTML = "";
    const canvas = document.createElement("canvas");
    new QRious({
      element: canvas,
      backgroundAlpha: 0,
      foreground: "#181818",
      foregroundAlpha: 1,
      level: "H",
      size: 500,
      value: `${config.baseUrl}/authStation?stationId=${this.controller.stationId}`,
    });
    parent.appendChild(canvas);
  }
}
