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

  showSpecific() {
    this.insertContent();
  }

  insertContent() {
    const parent = this.element.querySelector(".code");
    const width = parent.getBoundingClientRect().width;
    const canvas = document.createElement("canvas");
    new QRious({
      element: canvas,
      background: "#000",
      backgroundAlpha: 0.1,
      foreground: "#181818",
      foregroundAlpha: 1,
      level: "H",
      padding: 16,
      size: width,
      value: `/authStation?stationId=${this.controller.stationId}`,
    });
    parent.appendChild(canvas);
  }
}
