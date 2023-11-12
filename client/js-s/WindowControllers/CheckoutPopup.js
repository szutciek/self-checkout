import Popup from "./Popup.js";

import languages from "../languages.js";
import {
  itemClickAnimationWide,
  itemClickOptions,
  accentItemClickAnimation,
  accentItemClickOptions,
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

  closeSummaryDuration = 300;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
  }

  handleOutsideClick(e) {
    if (this.inTransition) return;
    this.currentClamp = 0;
    this.smoothResize();
  }

  handleClick(e) {
    if (e.target.closest(".cancelOrder")) return this.controller.cancelOrder();
    if (e.target.closest(".logUserIn")) return this.loginClicked();
    if (e.target.closest(".showSummary")) return this.summaryButtonClick();
    if (e.target.closest(".backToMenu")) return this.backToMenuButtonClick();
    if (e.target.closest(".confirmCheckout"))
      return this.confirmCheckoutButtonClick();
    if (e.target.closest(".item")) return this.handleItemClick(e);
  }

  loginClicked() {
    this.selectLogin();
    this.controller.showLogin();
    setTimeout(() => this.hide(), 200);
  }

  showSpecific() {
    this.insertContent();
    this.deselectLogin();
    this.checkIfCompleted(false);
    this.showBrief();
    this.hideSummary();
  }

  handleUserChange(user) {
    this.checkIfCompleted();
    this.insertUserContent();
    this.selectLogin();
    setTimeout(() => this.deselectLogin(), 1000);
  }

  checkIfCompleted(alert = true) {
    let completed = true;
    if (!this.controller.user) {
      completed = false;
      if (alert === true) this.attractAttentionLogin();
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

    const button = this.element.querySelector(".showSummary");
    button.animate(accentItemClickAnimation, accentItemClickOptions);
    setTimeout(() => {
      this.showSummary();
      this.hideBrief();
    }, accentItemClickOptions.duration - 50);
  }

  confirmCheckoutButtonClick() {
    const button = this.element.querySelector(".confirmCheckout");
    button.animate(accentItemClickAnimation, accentItemClickOptions);
    setTimeout(() => {
      this.controller.confirmOrder();
      this.hide();
    }, accentItemClickOptions.duration - 50);
  }

  backToMenuButtonClick() {
    this.hideSummary();
    this.showBrief();
  }

  showSummary() {
    this.currentClamp = 1;
    const sumEl = this.element.querySelector(".summary");
    sumEl.classList.remove("hidden");
    sumEl.style.maxHeight = `${this.translateChangeElementHeight(
      this.clamps[1]
    )}px`;
    this.showSummaryButtons();
    this.smoothResize();
  }

  hideSummary() {
    this.currentClamp = 0;
    const sumEl = this.element.querySelector(".summary");
    sumEl.classList.add("hidden");
    sumEl.style.maxHeight = "0px";
    this.hideSummaryButtons();
    this.smoothResize();
  }

  showSummaryButtons() {
    const buttonDiv = this.element.querySelector(".lastAction");
    buttonDiv.style.transform = "translateY(0%)";
  }

  hideSummaryButtons() {
    const buttonDiv = this.element.querySelector(".lastAction");
    buttonDiv.style.transform = "translateY(100%)";
  }

  showBrief() {
    this.currentClamp = 0;
    const brEl = this.element.querySelector(".brief");
    brEl.classList.remove("hidden");
    brEl.style.maxHeight = `${this.translateChangeElementHeight(
      this.clamps[0]
    )}px`;
    this.smoothResize();
  }

  hideSpecific() {
    return new Promise((res) => {
      if (this.currentClamp === 1) {
        this.hideSummary();
        this.showBrief();
        setTimeout(() => {
          res();
        }, this.closeSummaryDuration);
      } else {
        res();
      }
    });
  }

  hideBrief() {
    this.currentClamp = 1;
    const brEl = this.element.querySelector(".brief");
    brEl.classList.add("hidden");
    brEl.style.maxHeight = "0px";
    this.smoothResize();
  }

  updateCart() {
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

  insertWarnings() {
    if (!this.controller.user) return;
    const allergyList = this.controller.user.allergies;
    // console.log(allergyList);
    const container = this.element.querySelector(".warnings");
    container.classList.add("hidden");
    container.innerHTML = "";
    if (this.controller.cart.items.length === 0) return;
    const title = document.createElement("h2");
    title.innerHTML = `${languages[this.controller.lang].ui.warnings.title}`;
    const details = document.createElement("p");
    const item = this.controller.cart.items.find(
      (item) => item.product.id === "6504337f6c955036a658a054"
    )?.product;
    if (!item) return;
    const list = [];
    item.properties.forEach((prop) => {
      if (allergyList.includes(prop.name)) {
        list.push(prop.name);
      }
    });
    if (list.length === 0) return;
    const detailString = `${item.name}${
      languages[this.controller.lang].ui.warnings.allergen
    }${list[0]}${languages[this.controller.lang].ui.warnings.explain}`;
    details.innerHTML = detailString;
    container.appendChild(title);
    container.appendChild(details);
    container.classList.remove("hidden");
  }

  insertSummaryContent() {
    const container = this.element.querySelector("#itemList");
    let itemString = languages[this.controller.lang].ui.itemsList;
    itemString += this.controller.cart.items
      .map((item) => {
        return `
        <div class="item itemClickAnimation" data-id="${
          item.product.id
        }" data-size="${item.size}">
          <div class="preview">
            <img
              src="${item.product.image}"
              alt="${item.product.name}"
            />
          </div>
          <div class="info">
            <h2>${item.product.name}</h2>
            <p class="price">${item.price / 100}zł</p>
            <p class="size"><span>${item.product.sizes[item.size].name}</span>${
          item.product.sizes[item.size].size
        }</p>
          </div>
          <div class="quantity">
            <div class="adjust flexVert"><button class="add">&plus;</button><h2>${
              item.quantity
            }x</h2><button class="subtract">&minus;</button></div>
            <button class="delete">&times;</button>
          </div>
        </div>
        `;
      })
      .join("");
    container.innerHTML = itemString;
  }

  insertSummaryTitleContent() {
    const title = this.element.querySelector(".summaryHead h1");
    const second = this.element.querySelector(".summaryHead p");
    const total = this.element.querySelector(".total .texts p");
    title.innerText = languages[this.controller.lang].ui.summary.title;
    second.innerText = languages[this.controller.lang].ui.summary.second;
    total.innerText = languages[this.controller.lang].ui.summary.total;
  }

  insertSummaryButtonsContent() {
    const confirm = this.element.querySelector(".confirmCheckout");
    const back = this.element.querySelector(".backToMenu");
    confirm.innerHTML = languages[this.controller.lang].ui.completeOrder;
    back.innerHTML = languages[this.controller.lang].ui.backToMenu;
  }

  insertCartContent() {
    const total = this.controller.cart.total;
    this.element
      .querySelectorAll(".cartPrice")
      .forEach((el) => (el.innerHTML = `${Math.round(total) / 100}zł`));
    this.element.querySelector(
      ".total .itemCount"
    ).innerHTML = `${this.controller.cart.numberOfItems}`;
  }

  handleLanguageChange(lang) {
    this.insertContent();
  }

  insertContent() {
    this.insertCartContent();
    this.insertUserContent();
    this.insertButtonContent();

    this.insertSummaryContent();
    this.insertSummaryTitleContent();
    this.insertSummaryButtonsContent();

    this.insertWarnings();
  }

  handleItemClick = (e) => {
    if (e.target.closest(".info")) {
      const el = e.target.closest(".item");
      el.animate(itemClickAnimationWide, itemClickOptions);
      setTimeout(() => {
        this.hide();
        setTimeout(() => {
          this.controller.showItem(
            this.controller.menu.getProductById(
              e.target.closest(".item").dataset.id
            )
          );
        }, this.closeSummaryDuration + 100);
      }, itemClickOptions.duration + 100);

      return;
    }
    const id = e.target.closest(".item").dataset.id;
    const size = e.target.closest(".item").dataset.size;
    if (e.target.closest(".add")) {
      return this.controller.cart.incrementItemQuantity(id, size);
    }
    if (e.target.closest(".subtract")) {
      return this.controller.cart.reduceItemQuantity(id, size);
    }
    if (e.target.closest(".delete")) {
      return this.controller.cart.removeItem(id, size);
    }
  };
}
