import Popup from "./Popup.js";

import {
  selectItemClickAnimation,
  selectItemClickOptions,
} from "../animations.js";

export default class CheckoutPopup extends Popup {
  // Customizable variables
  clamps = ["px:180", "vh:100"];
  defaultClamp = "px:180";
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
    if (e.target.closest(".showSummary")) return this.showSummary();
  }

  loginClicked() {
    this.controller.showLogin();
    this.selectLogin();
  }

  userChange() {
    this.deselectLogin();
    this.checkIfCompleted();
  }

  checkIfCompleted() {
    let completed = true;
    if (!this.controller.user) completed = false;

    if (completed) {
      this.unlockCheckoutButton();
    } else {
      this.lockCheckoutButton();
    }
  }

  unlockCheckoutButton() {}
  lockCheckoutButton() {}

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

  showSummary() {
    this.currentClamp = 1;
    this.smoothResize();
    this.deselectLogin();
  }

  cartUpdated() {
    const total = this.controller.cart.reduce(
      (acc, cur) => acc + Number(cur.price),
      0
    );
    this.element.querySelector(".total").innerHTML = `<h1>${
      Math.round(total) / 100
    }zł</h1>`;
  }
}
