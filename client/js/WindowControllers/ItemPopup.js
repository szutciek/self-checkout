import Popup from "./Popup.js";

export default class ItemPopup extends Popup {
  duration = 800;
  delay = 400;

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
  currentClamp = 2;
  clamps = ["px:150", "vh:50", "vh:90"];

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
    const imageToPopupEdgeY = 66;

    const predictedPositionY =
      window.innerHeight * (1 - this.defaultOpenMultiplier) + imageToPopupEdgeY;

    // change value if css is adjusted in any way
    const marginLeft =
      window.innerWidth >= 800 ? (window.innerWidth - 800) / 2 : 0;

    const predictedPositionX = marginLeft + 16;

    const width =
      window.innerWidth >= 800 ? 368 : (window.innerWidth - 112) / 3;

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
      this.movementDirection = -Math.sign(touch.clientY - this.previousTouch);
      if (touch.clientY - this.previousTouch > 25) this.movementDirection = -2;
      if (touch.clientY - this.previousTouch < -25) this.movementDirection = 2;
      this.resize(touch.clientY - this.previousTouch);
      this.previousTouch = e.targetTouches[0].clientY;
    }
  }

  handleTouchEnd(e) {
    if (this.moving === true) {
      e.preventDefault();
      this.clampHeight(this.movementDirection);
      this.movementDirection = 0;
    }
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

    this.currentClamp = this.determineClamp(direction);
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
      return differences.filter((difference) => difference < 0).length - 1;
    }
    if (direction === 1) {
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

  showItem(product, item) {
    if (this.visible === true) {
      this.#animationDelay = 300;
      this.hide();
      setTimeout(() => {
        this.insertContent(product, item);
        this.show();
        this.#animationDelay = 0;
      }, this.#animationDelay);
    } else {
      this.#animationDelay = 0;
      this.insertContent(product, item);
      this.show();
    }
    this.currentProduct = product;
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
    this.currentClamp = 2;
    this.elementHeight = window.innerHeight * this.defaultOpenMultiplier;
    this.resize();
    const staticImage = this.element.querySelector("img");
    staticImage.style.opacity = 0;
    this.element.animate(this.animation, {
      ...this.options,
      duration: this.duration,
      delay: this.delay,
    });
    setTimeout(() => {
      staticImage.style.opacity = 1;
      this.element.style.pointerEvents = "none";
      this.element.style.opacity = 0;
      this.resize();
      this.inTransition = false;
    }, this.duration + this.delay);
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

  get zoomDuration() {
    return this.duration;
  }
  get zoomDelay() {
    return this.delay + this.#animationDelay;
  }
}
