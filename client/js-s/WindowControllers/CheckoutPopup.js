import Popup from "./Popup.js";

import languages from "../languages.js";
import {
  selectItemClickAnimation,
  selectItemClickOptions,
  attentionAnimation,
} from "../animations.js";

export default class CheckoutPopup extends Popup {
  // Customizable variables
  clamps = ["px:180", "vh:100"];
  defaultClamp = "px:180";
  duration = 300;
  delay = 0;
  userDraggable = false;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick(e) {
    if (this.inTransition) return;
    this.currentClamp = 0;
    this.smoothResize();
  }

  handleTouchStart(e) {
    if (e.target.closest(".cancelOrder")) return this.controller.cancelOrder();
    if (e.target.closest(".logUserIn")) return this.loginClicked();
    if (e.target.closest(".showSummary")) return this.summaryButtonClick();
  }

  loginClicked() {
    this.selectLogin();
    this.controller.showLogin();
    setTimeout(() => this.hide(), 200);
  }

  showSpecific() {
    this.insertContent();
    this.deselectLogin();
  }

  handleUserChange(user) {
    this.checkIfCompleted();
    this.insertUserContent();
    this.selectLogin();
    setTimeout(() => this.deselectLogin(), 1000);
  }

  checkIfCompleted() {
    let completed = true;
    if (!this.controller.user) {
      completed = false;
      this.attractAttentionLogin();
    }

    if (completed === true) {
      this.unlockCheckoutButton();
    } else {
      this.lockCheckoutButton();
    }

    return completed;
  }

  attractAttentionLogin() {
    const button = this.element.querySelector(".logUserIn");
    button.animate(attentionAnimation, {
      duration: 500,
      easing: "ease-in-out",
    });
  }

  unlockCheckoutButton() {
    const button = this.element.querySelector(".showSummary");
    button.classList.remove("locked");
  }
  lockCheckoutButton() {
    const button = this.element.querySelector(".showSummary");
    button.classList.add("locked");
  }

  selectLogin() {
    const button = this.element.querySelector(".logUserIn");
    button.style.pointerEvents = "none";
    button.animate(selectItemClickAnimation, selectItemClickOptions);
    setTimeout(() => {
      button.classList.add("active");
    }, selectItemClickOptions.duration / 2);
  }

  deselectLogin() {
    const button = this.element.querySelector(".logUserIn");
    button.classList.remove("active");
    button.style.pointerEvents = "auto";
  }

  summaryButtonClick() {
    const ready = this.checkIfCompleted();
    if (!ready) return;

    this.showSummary();
    this.hideBrief();
  }

  showSummary() {
    this.insertSummaryContent();
    this.currentClamp = 1;
    this.element.querySelector(".summary").style.opacity = 1;
    this.element.querySelector(".summary").style.height = "auto";
    console.log(this.currentClamp);
    this.smoothResize();
  }

  hideSummary() {
    this.currentClamp = 0;
    this.element.querySelector(".summary").style.opacity = 0;
    this.element.querySelector(".summary").style.height = 0;
    this.smoothResize();
  }

  showBrief() {
    this.currentClamp = 0;
    this.element.querySelector(".brief").style.maxHeight = "300px";
    this.smoothResize();
  }

  hideBrief() {
    this.currentClamp = 1;
    this.element.querySelector(".brief").style.maxHeight = "0px";
    this.smoothResize();
  }

  insertContent() {
    this.insertSummaryContent();
    this.insertCartContent();
    this.insertUserContent();
    this.insertButtonContent();
  }

  cartUpdated() {
    this.insertContent();
  }

  insertButtonContent() {
    const showSummary = this.element.querySelector(".showSummary");
    const cancelOrder = this.element.querySelector(".cancelOrder");
    showSummary.innerHTML = languages[this.controller.lang].ui.showSummary;
    cancelOrder.innerHTML = languages[this.controller.lang].ui.cancelOrder;
  }

  insertUserContent() {
    const loginText = this.element.querySelector(".loginText");
    if (this.controller.user != null) {
      loginText.innerText = this.controller.user.name;
    } else {
      loginText.innerText = languages[this.controller.lang].ui.clickToLogin;
    }
  }

  insertSummaryContent() {
    const container = this.element.querySelector(".summary");
    container.innerHTML = `${this.controller.cart
      .map((prod) => `<p>${prod.name}</p>`)
      .join("")}`;
  }

  insertCartContent() {
    const total = this.controller.cart.reduce(
      (acc, cur) => acc + Number(cur.price),
      0
    );
    this.element.querySelector(".total .cartPrice").innerHTML = `${
      Math.round(total) / 100
    }zł`;
    this.element.querySelector(
      ".total .itemCount"
    ).innerHTML = `${this.controller.cart.length}`;
  }

  handleLanguageChange(lang) {
    this.insertContent();
  }
}
