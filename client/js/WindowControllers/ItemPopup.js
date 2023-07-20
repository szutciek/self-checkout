import {
  accentItemClickAnimation,
  accentItemClickOptions,
  selectItemClickAnimation,
  selectItemClickOptions,
} from "../animations.js";
import Popup from "./Popup.js";

export default class ItemPopup extends Popup {
  // Customizable variables
  duration = 600;
  delay = 200;
  clamps = ["px:150", "px:330", "vh:85", "vh:100"];

  // Keep the same (require more changes)
  currentProduct = {};

  elementHeight = 0;
  previousTouch = 0;
  movementDirection = 0;
  moving = false;
  visible = false;
  inTransition = false;
  defaultOpenMultiplier = 0.85;
  #imageZoomPosition = {
    top: 0,
    left: 0,
    width: 0,
  };
  #animationDelay = 0;
  #currentClamp = 2;

  allowSizeChange = true;
  selectedSize = "";

  animation = [
    {
      pointerEvents: "none",
      transform: "translateY(100%)",
      opacity: 1,
    },
    {
      pointerEvents: "auto",
      transform: "translateY(0)",
      opacity: 1,
    },
  ];
  options = {
    iterations: 1,
    fill: "forwards",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  };

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
    this.handleCreation();
  }

  handleCreation() {
    this.elementHeight = this.element.getBoundingClientRect().height;
    this.addEventListeners();
    this.calculateImageZoomPosition();
  }

  calculateImageZoomPosition() {
    // change value if css is adjusted in any way
    const imageToPopupEdgeY = 50;

    const predictedPositionY =
      window.innerHeight * (1 - this.defaultOpenMultiplier) + imageToPopupEdgeY;

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
      this.currentClamp = 0;
      this.elementHeight = this.translateChangeElementHeight(
        this.clamps[this.currentClamp]
      );
      this.smoothResize();
    }
  }

  addEventListeners() {
    this.element.addEventListener("touchstart", this.handleTouch);
    this.element.addEventListener("touchmove", this.handleTouch);
    this.element.addEventListener("touchend", this.handleTouch);
    this.element.addEventListener("touchcancel", this.handleTouch);
    window.addEventListener(
      "resize",
      this.calculateImageZoomPosition.bind(this)
    );
  }

  handleTouch = (e) => {
    if (e.type === "touchstart") this.handleTouchStart(e);
    if (e.type === "touchend") this.handleTouchEnd(e);
    if (e.type === "touchmove") this.handleTouchMove(e);
    if (e.type === "touchcancel") this.handleTouchEnd(e);
  };

  handleTouchStart(e) {
    if (e.target.closest(".move")) this.handleStartMovement(e);
    if (e.target.closest(".sizeOption")) this.handleSizeSelection(e);
    if (e.target.closest(".confirmAddButton")) this.handleAddToCart();
    if (e.target.closest(".cancelItem")) this.hide();
  }

  handleTouchMove(e) {
    if (this.moving === true) this.handleMovement(e);
  }

  handleTouchEnd(e) {
    if (this.moving === true) this.handleEndMovement(e);
  }

  handleStartMovement(e) {
    const target = e.target.closest(".move");
    if (target && !this.inTransition && !this.moving) {
      e.preventDefault();
      this.previousTouch = e.targetTouches[0].clientY;
      this.moving = true;
    }
  }

  handleMovement(e) {
    e.preventDefault();
    const touch = e.targetTouches[0];
    this.movementDirection = -Math.sign(touch.clientY - this.previousTouch);
    if (touch.clientY - this.previousTouch > 25) this.movementDirection = -2;
    if (touch.clientY - this.previousTouch < -25) this.movementDirection = 2;
    this.resize(touch.clientY - this.previousTouch);
    this.previousTouch = e.targetTouches[0].clientY;
  }

  handleEndMovement(e) {
    e.preventDefault();
    this.clampHeight(this.movementDirection);
    this.movementDirection = 0;
    this.moving = false;
  }

  clampHeight(direction) {
    if (direction === 0) return;
    if (direction === -2) return this.hide();
    if (direction === 2) {
      this.currentClamp = this.clamps.length - 1;
      this.elementHeight = this.translateChangeElementHeight(
        this.clamps[this.currentClamp]
      );
    }

    const newClamp = this.determineClamp(direction);
    if (newClamp === -1) return this.hide();
    this.currentClamp = newClamp;
    this.elementHeight = this.translateChangeElementHeight(
      this.clamps[this.currentClamp]
    );
    this.smoothResize();
  }

  determineClamp(direction) {
    const heights = this.clamps.map((clamp) =>
      this.translateChangeElementHeight(clamp)
    );
    const differences = heights.map((height) => height - this.elementHeight);

    if (direction === -1) {
      const n = differences.filter((difference) => difference < 0).length - 1;
      if (n === differences.length) return differences.length - 1;
      if (n < 0) return -1;
      return differences.filter((difference) => difference < 0).length - 1;
    }
    if (direction === 1) {
      const n =
        differences.length -
        differences.filter((difference) => difference > 0).length;
      if (n === differences.length) return differences.length - 1;
      if (n < 0) return -1;
      return (
        differences.length -
        differences.filter((difference) => difference > 0).length
      );
    }

    return this.currentClamp;
  }

  translateChangeElementHeight(string) {
    if (!string) return this.elementHeight;
    const [unit, value] = string.split(":");
    if (!unit || !value) return this.elementHeight;
    if (unit === "px") return Number(value);
    if (unit === "vh") return Number((window.innerHeight * value) / 100);
  }

  resize(difference = 0) {
    this.elementHeight -= difference;
    this.element.style.height = `${this.elementHeight}px`;
  }

  smoothResize() {
    this.element.style.transition = "0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    this.resize();
    this.inTransition = true;
    setTimeout(() => {
      this.element.style.transition = "0s";
      this.inTransition = false;
    }, 400);
  }

  showItem(product, item, zooming = false) {
    this.resetData();
    this.checkIfCompleted();
    if (this.visible === true) {
      this.#animationDelay = 300;
      this.hide();
      setTimeout(() => {
        this.insertContent(product, item);
        this.show(zooming);
        this.#animationDelay = 0;
      }, this.#animationDelay);
    } else {
      this.#animationDelay = 0;
      this.insertContent(product, item);
      this.show(zooming);
    }
    this.currentProduct = product;
  }

  resetData() {
    this.currentProduct = {};
    this.selectedSize = "";
    this.currentClamp = 2;
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
    ingredients.classList.add("scroller");
    ingredients.innerHTML = `
        ${product.ingredients
          .map(
            (ingredient) =>
              `<div>
                <p class="info"><span>${ingredient.icon}</span>&nbsp;${ingredient.name}</p>
                <div class="benefits">
                  <p>${ingredient.info}</p>
                  <a href="${ingredient.learnUrl}" target="_blank">Learn more &rarr;</a>
                </div>
              </div>
              `
          )
          .join("")}
      `;
    return ingredients;
  }

  createSizeMenu(product) {
    const sizeMenu = document.createElement("div");
    sizeMenu.innerHTML = `
      <ul>
        ${Object.entries(product.sizes)
          .map(
            ([name, info]) => `
          <li class="itemClickAnimation sizeOption" data-size="${name}">
            <p class="name">${name[0].toUpperCase() + name.slice(1)}</p>
            <p class="size">${info.size}</p>
            <p class="price">${info.price / 100}PLN</p>
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
        setTimeout(() => {
          item.animate(selectItemClickAnimation, selectItemClickOptions);
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
    if (!this.selectedSize) completed = false;

    if (completed) {
      this.unlockAddToCartButton();
    } else {
      this.lockAddToCartButton();
    }
  }

  unlockAddToCartButton() {
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    buttons.forEach((button) => {
      button.innerHTML = `&check; Add ${this.selectedSize
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")} ${this.currentProduct.name.split(" ")[0]} to cart`;
      button.classList.remove("locked");
    });
  }
  lockAddToCartButton() {
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    buttons.forEach((button) => {
      button.innerHTML = `&check; Add to cart`;
      button.classList.add("locked");
    });
  }

  handleAddToCart() {
    const buttons = this.element.querySelectorAll(".confirmAddButton");
    buttons.forEach((button) => {
      button.animate(accentItemClickAnimation, accentItemClickOptions);
      setTimeout(() => {
        this.hide();
      }, accentItemClickOptions.duration + 500);
    });
  }

  show(zooming) {
    if (this.visible || this.inTransition) return;
    this.element.querySelector(".content").scrollTo(0, 0);
    this.inTransition = true;
    this.visible = true;
    this.elementHeight = window.innerHeight * this.defaultOpenMultiplier;
    this.resize();
    const staticImage = this.element.querySelector("img");
    if (zooming) staticImage.style.opacity = 0;
    this.element.animate(this.animation, {
      ...this.options,
      duration: this.duration,
      delay: this.delay,
    });
    setTimeout(
      () => {
        staticImage.style.opacity = 1;
        this.element.style.pointerEvents = "none";
        this.element.style.opacity = 0;
        this.resize();
        this.inTransition = false;
      },
      zooming ? this.duration + this.delay : this.duration
    );
  }

  hide() {
    if (!this.visible || this.inTransition) return;
    this.inTransition = true;
    this.visible = false;
    this.element.animate([...this.animation].reverse(), {
      ...this.options,
      delay: 0,
      duration: 300,
    });
    setTimeout(() => {
      this.element.style.pointerEvents = "none";
      this.element.style.opacity = 0;
      this.inTransition = false;
    }, 300);
  }

  toggleFloatingButton() {
    const floatingButton = this.element.querySelector(".floatingButton");
    if (this.currentClamp >= 2) {
      floatingButton.style.transform = "translateY(0)";
    } else {
      floatingButton.style.transform = "translateY(100%)";
    }
  }

  get currentClamp() {
    return this.#currentClamp;
  }
  set currentClamp(value) {
    this.#currentClamp = value;
    this.toggleFloatingButton();
  }

  get animationDelay() {
    return this.#animationDelay;
  }
  get imageZoomPosition() {
    return this.#imageZoomPosition;
  }

  get zoomDuration() {
    return this.duration;
  }
  get zoomDelay() {
    return this.delay + this.#animationDelay;
  }
}
