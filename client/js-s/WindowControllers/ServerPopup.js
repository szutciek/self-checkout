import Popup from "./Popup.js";

import config from "../config.js";
import languages from "../languages.js";
import {
  accentItemClickAnimation,
  accentItemClickOptions,
} from "../animations.js";

export default class ServerPopup extends Popup {
  // Customizable variables
  clamps = ["vh:50"];
  defaultClamp = "vh:50";
  delay = 0;
  userDraggable = false;

  #loading = false;
  dots = "";

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick() {
    if (this.#loading === true) return;
    this.hide();
  }

  handleClick(e) {
    if (e.target.closest(".closePopup")) this.handleCloseClick();
  }

  handleCloseClick() {
    const button = this.element.querySelector(".closePopup");
    button.animate(accentItemClickAnimation, accentItemClickOptions);
    setTimeout(() => this.hide(), accentItemClickOptions.duration + 100);
  }

  showSuccess(message) {
    if (this.#loading === true) this.hideMessage();
    this.hideAllDivs();
    this.element.querySelector("#message").classList.add("success");
    this.element.querySelector(".success").classList.remove("hidden");
    this.updateMessageDisplay(message);
    this.show();
  }

  showLoading(message) {
    if (this.#loading === true) this.hideMessage();
    this.hideAllDivs();
    this.element.querySelector("#message").classList.add("loading");
    this.element.querySelector(".loading").classList.remove("hidden");
    this.message = message;
    this.updateLoadingMessageDisplay();
    this.interval = setInterval(() => this.updateLoadingMessageDisplay(), 200);
    this.#loading = true;
    // this.evaluateButtonVisibility();
    this.show();
  }

  showError(message) {
    if (this.#loading === true) this.hideMessage();
    this.hideAllDivs();
    this.element.querySelector("#message").classList.add("error");
    this.element.querySelector(".error").classList.remove("hidden");
    this.updateMessageDisplay(message);
    this.show();
  }

  hideAllDivs() {
    this.element.querySelector(".loading").classList.add("hidden");
    this.element.querySelector(".success").classList.add("hidden");
    this.element.querySelector(".error").classList.add("hidden");

    const message = this.element.querySelector("#message");
    message.classList.remove("error");
    message.classList.remove("success");
    message.classList.remove("loading");

    this.evaluateButtonVisibility();
  }

  updateMessageDisplay(message) {
    this.element.querySelector("#message").innerText = message;
  }

  showSpecific() {
    this.evaluateButtonVisibility();
  }

  evaluateButtonVisibility() {
    if (this.#loading === true) return this.hideCloseButton();
    this.showCloseButton();
  }

  hideCloseButton() {
    const button = this.element.querySelector(".floatingButton");
    button.style.transform = "translateY(100%)";
  }

  showCloseButton() {
    const button = this.element.querySelector(".floatingButton");
    button.style.transform = "translateY(0)";
  }

  updateLoadingMessageDisplay() {
    const messageField = this.element.querySelector("#message");
    if (this.dots.length === 0) {
      this.dots = ".";
    } else if (this.dots.length === 1) {
      this.dots = "..";
    } else if (this.dots.length === 2) {
      this.dots = "...";
    } else {
      this.dots = "";
    }
    messageField.innerHTML = this.message + this.dots.padEnd(3, " ");
  }

  hideMessage() {
    clearInterval(this.interval);
    this.message = "";
    this.dots = "";
    this.#loading = false;
  }

  handleLanguageChange() {
    this.insertButtonContent();
  }

  hideSpecific() {
    return new Promise((res) => {
      this.hideMessage();
      res();
    });
  }

  insertButtonContent() {
    const button = this.element.querySelector(".closePopup");
    button.innerText = languages[this.controller.lang].ui.closeServerMessage;
  }

  get loading() {
    return this.#loading;
  }
}
