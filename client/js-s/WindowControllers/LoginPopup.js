import Popup from "./Popup.js";

import config from "../config.js";
import languages from "../languages.js";

export default class LoginPopup extends Popup {
  // Customizable variables
  clamps = ["px:387", "vh:100"];
  defaultClamp = "px:387";
  delay = 200;
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

  handleClick(e) {
    // temporary
    return;
    if (e.target.closest(".useAccountData")) {
      this.currentClamp = 1;
      this.smoothResize();
    }
  }

  insertUIContent() {
    const useAccountData = this.element.querySelector(".useAccountData");
    const instructionsCode = this.element.querySelector(".instructionsCode");
    useAccountData.innerText =
      languages[this.controller.lang].ui.useAccountData;
    instructionsCode.innerHTML =
      languages[this.controller.lang].ui.instructionsCode;
  }

  insertContent() {
    this.insertUIContent();
    const parent = this.element.querySelector(".codeBackground");
    parent.innerHTML = "";
    parent.innerHTML += `<a href="${`${config.baseUrl}/authorize?sessionId=${this.controller.sessionId}`}" target="_blank">URL</a>`;
    const canvas = document.createElement("canvas");
    new QRious({
      element: canvas,
      backgroundAlpha: 0,
      foreground: "#181818",
      foregroundAlpha: 1,
      level: "H",
      size: 500,
      value: `${config.baseUrl}/authorize?sessionId=${this.controller.sessionId}`,
    });
    parent.appendChild(canvas);
  }
}
