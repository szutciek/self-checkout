import Popup from "./Popup.js";

import languages from "../languages.js";
import {
  accentItemClickAnimation,
  accentItemClickOptions,
  selectItemClickAnimation,
  selectItemClickOptions,
  attentionAnimation,
} from "../animations.js";

export default class ItemPopup extends Popup {
  // Customizable variables
  clamps = ["px:180", "px:330", "px:900", "vh:100"];
  defaultClamp = "px:900";
  duration = 600;
  delay = 150;
  hideDuration = 500;

  currentProduct = {};
  #imageZoomPosition = {
    top: 0,
    left: 0,
    width: 0,
  };

  allowSizeChange = true;
  selectedSize = "";

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
    this.handleCreation();
  }

  handleCreation() {
    window.addEventListener("resize", () => this.calculateImageZoomPosition());
    this.calculateImageZoomPosition();
  }

  calculateImageZoomPosition() {
    // change value if css is adjusted in any way
    const imageToPopupEdgeY = 50;
    const translated = this.translateChangeElementHeight(this.defaultClamp);

    const predictedPositionY =
      window.innerHeight -
      (translated > window.innerHeight ? window.innerHeight : translated) +
      imageToPopupEdgeY;

    // change value if css is adjusted in any way
    const marginLeft =
      window.innerWidth >= 800 ? (window.innerWidth - 800) / 2 : 0;

    const predictedPositionX = marginLeft + 16;

    const width = window.innerWidth >= 800 ? 368 : (window.innerWidth - 64) / 2;

    this.#imageZoomPosition = {
      top: predictedPositionY,
      left: predictedPositionX,
      width,
    };
  }

  handleOutsideClick(e) {
    if (this.inTransition) return;
    if (e.target.closest(".item")?.dataset.id !== this.currentProduct.id) {
      // hide if user clicks outside again
      if (this.currentClamp === 0) return this.hide();
      // or move to bottom if first time
      this.currentClamp = 0;
      this.smoothResize();
    }
  }

  handleClick(e) {
    if (e.target.closest(".sizeOption")) return this.handleSizeSelection(e);
    if (e.target.closest(".confirmAddButton")) return this.handleAddToCart();
    if (e.target.closest(".cancelItem")) return this.hide();
    if (e.target.closest(".redirectUser")) return this.redirectUser(e);
  }

  resetData() {
    this.currentProduct = {};
    this.selectedSize = "";
  }

  redirectUser(e) {
    const url = e.target.closest(".redirectUser").dataset.url;
    if (!url) return;
    this.controller.redirectUser(url);
  }

  insertContent(product, item) {
    const detailsParent = this.element.querySelector("#itemPopupDescription");
    if (!detailsParent) return;
    detailsParent.innerHTML = "";
    const image = item.querySelector("img").cloneNode(false);
    const details = this.createDetails(product);
    detailsParent.insertAdjacentElement("afterbegin", image);
    detailsParent.insertAdjacentElement("beforeend", details);

    const sizeMenuParent = this.element.querySelector("#itemPopupSizeMenu");
    if (!sizeMenuParent) return;
    sizeMenuParent.innerHTML = "";
    const sizeMenu = this.createSizeMenu(product);
    sizeMenuParent.insertAdjacentElement("afterbegin", sizeMenu);

    const ingredientsParent = this.element.querySelector(
      "#itemPopupIngredients"
    );
    if (!ingredientsParent) return;
    ingredientsParent.innerHTML = "";
    const ingredients = this.createIngredients(product);
    ingredientsParent.insertAdjacentElement("afterbegin", ingredients);
  }

  createIngredients(product) {
    const ingredients = document.createElement("div");
    ingredients.innerHTML = `
    <div class="fadeX">
      <div class="scrollerFadeX">
        <div class="scroller">
          ${product.ingredients
            .map(
              (ingredient) =>
                `<div>
                <p class="info"><span>${ingredient.icon}</span>&nbsp;${
                  ingredient.name
                }</p>
                <div class="benefits">
                  <p>${ingredient.info}</p>
                  <button class="redirectUser" data-url="${
                    ingredient.learnUrl
                  }">${languages[this.controller.lang].ui.learnMore}</button>
                </div>
              </div>
              `
            )
            .join("")}
            </div>
          </div>
      </div>
      `;
    return ingredients;
  }

  createSizeMenu(product) {
    const sizeMenu = document.createElement("div");
    sizeMenu.innerHTML = `
      <ul>
        ${Object.entries(product.sizes)
          .map(
            ([name, size]) => `
          <li class="itemClickAnimation sizeOption" data-size="${name}">
            <p class="name">${size.name}</p>
            <p class="size">${size.size}</p>
            <p class="price">${size.price / 100}zł</p>
          </li>
        `
          )
          .join("")}
      </ul>
      `;

    return sizeMenu;
  }

  handleSizeSelection(e) {
    if (this.allowSizeChange === false) return;
    this.allowSizeChange = false;
    this.selectedSize = e.target.closest(".sizeOption").dataset.size;
    const sizeMenuItems = this.element.querySelectorAll(".sizeOption");
    sizeMenuItems.forEach((item) => {
      if (item.dataset.size === this.selectedSize) {
        item.animate(selectItemClickAnimation, selectItemClickOptions);
        setTimeout(() => {
          item.classList.add("active");
          this.allowSizeChange = true;
        }, selectItemClickOptions.duration - 20);
      } else {
        item.classList.remove("active");
      }
    });
    this.checkIfCompleted();
  }

  createDetails(product) {
    const details = document.createElement("div");
    details.classList.add("details");

    details.innerHTML = `
    <h1>${product.name}</h1>
    <div class="section properties">
      <ul>
        ${product.properties
          .map((property) => `<li>${property.icon} ${property.name}</li>`)
          .join("")}
      </ul>
    </div>
    <div class="section nutrition">
      <ul>
        ${product.nutrition
          .map(
            (value) =>
              `<li><p class="name">${value.name}</p><p class="value">${value.value}</p></li>`
          )
          .join("")}
      </ul>
      <p class="info">* ${product.nutritionInfo}</p>
    </div>
    `;
    return details;
  }

  checkIfCompleted() {
    let completed = true;
    if (!this.selectedSize) {
      completed = false;
      this.attractAttentionSize();
    }

    if (completed) {
      this.unlockAddToCartButton();
    } else {
      this.lockAddToCartButton();
    }
    return completed;
  }

  unlockAddToCartButton() {
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    const sizeNameLang = this.currentProduct.sizes[this.selectedSize].name;
    const text = languages[this.controller.lang].ui.addItemToCartSpecific;
    buttons.forEach((button) => {
      button.innerHTML = `${text[0]} ${sizeNameLang} ${
        this.currentProduct.name.split(" ")[0]
      } ${text[1]}`;
      button.classList.remove("locked");
    });
  }
  lockAddToCartButton() {
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    buttons.forEach((button) => {
      button.innerHTML = languages[this.controller.lang].ui.confirmAddToCart;
      button.classList.add("locked");
    });
  }

  attractAttentionSize() {
    const sizeMenuItems = this.element.querySelectorAll(".sizeOption");
    sizeMenuItems.forEach((item, index) => {
      item.animate(attentionAnimation, {
        delay: index * 100,
        duration: 500,
        easing: "ease-in-out",
      });
    });
  }

  handleAddToCart() {
    const ready = this.checkIfCompleted();
    if (!ready) return;

    this.controller.addToCart({
      id: this.currentProduct.id,
      price: this.currentProduct.sizes[this.selectedSize].price,
      size: this.selectedSize,
    });
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    buttons.forEach((button) => {
      button.animate(accentItemClickAnimation, accentItemClickOptions);
      setTimeout(() => {
        this.hide();
      }, accentItemClickOptions.duration);
    });
  }

  // lot of visilbe changes so that checkout window doesn't open (checks if all hidden)
  showItem(product, item, zooming = false) {
    this.resetData();
    this.checkIfCompleted();
    if (this.visible === true) {
      this.reopening = true;
      this.openDelay = this.hideDuration;
      this.hide();
      setTimeout(() => {
        this.insertContent(product, item);
        this.show(zooming);
        this.openDelay = 0;
      }, this.openDelay);
    } else {
      this.openDelay = 0;
      this.insertContent(product, item);
      this.show(zooming);
    }
    this.currentProduct = product;
  }

  insertUIContent() {
    const selectSize = this.element.querySelector("#selectSizeText");
    const ingredients = this.element.querySelector("#ingredients");
    selectSize.innerText = languages[this.controller.lang].ui.selectSize;
    ingredients.innerText = languages[this.controller.lang].ui.ingredients;

    const confirmAddButton = this.element.querySelector(".confirmAddButton");
    const cancelItem = this.element.querySelector(".cancelItem");
    confirmAddButton.innerHTML =
      languages[this.controller.lang].ui.confirmAddToCart;
    cancelItem.innerHTML = languages[this.controller.lang].ui.cancelItem;
  }

  showSpecific(useDelay) {
    this.element.querySelector(".content").scrollTo(0, 0);
    this.insertUIContent();
    const staticImage = this.element.querySelector("img");
    staticImage.style.transition = "0s";
    if (useDelay) staticImage.style.opacity = 0;
    setTimeout(
      () => {
        staticImage.style.opacity = 1;
        this.reopening = false;
      },
      useDelay ? this.duration + this.delay : this.duration
    );
  }

  handleLanguageChange() {
    this.hide();
    this.insertUIContent();
  }

  toggleFloatingButton() {
    const floatingButton = this.element.querySelector(".floatingButton");
    if (this.currentClamp >= 2) {
      floatingButton.style.transform = "translateY(0)";
    } else {
      floatingButton.style.transform = "translateY(100%)";
    }
  }

  clampChangeFunction() {
    this.toggleFloatingButton();
  }

  imageZoomPositionChangeFunction() {}

  get imageZoomPosition() {
    return this.#imageZoomPosition;
  }
}
