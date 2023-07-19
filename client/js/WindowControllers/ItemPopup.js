import Popup from "./Popup.js";

export default class ItemPopup extends Popup {
  duration = 800;
  delay = 200;

  currentProduct = {};

  elementHeight = 0;
  previousTouch = 0;
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
    duration: this.duration,
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
    const imageToPopupEdgeY = 66;

    const predictedPositionY =
      window.innerHeight * (1 - this.defaultOpenMultiplier) + imageToPopupEdgeY;

    // change value if css is adjusted in any way
    const marginLeft =
      window.innerWidth >= 800 ? (window.innerWidth - 800) / 2 : 0;

    const predictedPositionX = marginLeft + 32;

    const width =
      window.innerWidth >= 800 ? 230 : (window.innerWidth - 112) / 3;

    this.#imageZoomPosition = {
      top: predictedPositionY,
      left: predictedPositionX,
      width,
    };
  }

  handleOutsideClick(e) {
    // this.hide();
    if (e.target.closest(".item")?.dataset.id !== this.currentProduct.id) {
      this.elementHeight = window.innerHeight * 0.2;
      this.smoothResize();
    }
  }

  addEventListeners() {
    this.element.addEventListener("touchstart", this.handleTouch);
    this.element.addEventListener("touchmove", this.handleTouch);
    this.element.addEventListener("touchend", this.handleTouch);
    this.element.addEventListener("touchcancel", this.handleTouch);
  }

  handleTouch = (e) => {
    if (e.type === "touchstart") this.handleTouchStart(e);
    if (e.type === "touchend") this.handleTouchEnd(e);
    if (e.type === "touchmove") this.handleTouchMove(e);
    if (e.type === "touchcancel") this.handleTouchEnd(e);
  };

  handleTouchStart(e) {
    const target = e.target.closest(".move");
    if (target && !this.inTransition && !this.moving) {
      e.preventDefault();
      this.previousTouch = e.targetTouches[0].clientY;
      this.moving = true;
    }
  }

  handleTouchMove(e) {
    if (this.moving === true) {
      e.preventDefault();
      const touch = e.targetTouches[0];
      this.resize(touch.clientY - this.previousTouch);
      this.previousTouch = e.targetTouches[0].clientY;
    }
  }

  handleTouchEnd(e) {
    if (this.moving === true) {
      e.preventDefault();
      const height = this.element.getBoundingClientRect().height;
      this.clampHeight(height);
    }
    this.moving = false;
  }

  clampHeight(height) {
    if (height <= (window.innerHeight * 2) / 10) {
      this.hide();
    } else {
      if (
        height > (window.innerHeight * 2) / 10 &&
        height < (window.innerHeight * 7) / 10
      ) {
        this.elementHeight = window.innerHeight / 2;
      } else if (height >= (window.innerHeight * 7) / 10) {
        this.elementHeight = window.innerHeight * 0.9;
      }
      this.smoothResize();
    }
  }

  resize(difference = 0) {
    this.elementHeight -= difference;
    this.element.style.height = `${this.elementHeight}px`;
  }

  smoothResize() {
    this.element.style.transition = "0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    this.resize();
    this.inTransition = true;
    setTimeout(() => {
      this.element.style.transition = "0s";
      this.inTransition = false;
    }, 400);
  }

  showItem(product, item) {
    this.currentProduct = product;
    if (this.visible === true) {
      this.#animationDelay = 300;
      this.hide();
      setTimeout(() => {
        this.insertContent(product, item);
        this.show();
        this.#animationDelay = 0;
      }, 300);
    } else {
      this.insertContent(product, item);
      this.show();
    }
  }

  insertContent(product, item) {
    const imageToClone = item.querySelector("img");
    const image = imageToClone.cloneNode(false);

    const details = document.createElement("div");
    details.classList.add("details");

    details.innerHTML = `
    <h1>${product.name}</h1>
    <div class="section properties">
      <p>Properties</p>
        <ul>
          ${product.properties
            .map((property) => `<li>${property.icon} ${property.name}</li>`)
            .join("")}
      </ul>
    </div>
    <div class="section ingredients">
      <p>Ingredients</p>
      <ul>
        ${product.ingredients
          .map((ingredient) => `<li>${ingredient}</li>`)
          .join("")}
      </ul>
    </div>
    `;

    const parent = this.element.querySelector("#itemPopupDescription");
    if (!parent) return;
    parent.innerHTML = "";

    parent.insertAdjacentElement("afterbegin", image);
    parent.insertAdjacentElement("beforeend", details);
  }

  show() {
    if (this.visible || this.inTransition) return;
    this.inTransition = true;
    this.visible = true;
    this.elementHeight = window.innerHeight * this.defaultOpenMultiplier;
    this.resize();
    const staticImage = this.element.querySelector("img");
    staticImage.style.opacity = 0;
    this.element.animate(this.animation, {
      ...this.options,
      delay: this.delay,
    });
    setTimeout(() => {
      staticImage.style.opacity = 1;
      setTimeout(() => {
        this.element.style.pointerEvents = "none";
        this.element.style.opacity = 0;
        this.resize();
        this.inTransition = false;
      }, this.delay);
    }, this.duration);
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

  get animationDelay() {
    return this.#animationDelay;
  }
  get imageZoomPosition() {
    return this.#imageZoomPosition;
  }
}
