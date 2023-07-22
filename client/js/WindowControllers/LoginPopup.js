import config from "../config.js";

import Popup from "./Popup.js";

export default class LoginPopup extends Popup {
  // Customizable variables
  clamps = ["px:387", "vh:100"];
  defaultClamp = "px:387";
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

  handleTouchStart(e) {
    return;
    if (e.target.closest(".useAccountData")) {
      this.currentClamp = 1;
      this.smoothResize();
    }
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
