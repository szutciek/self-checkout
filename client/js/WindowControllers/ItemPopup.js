import Popup from "./Popup.js";

export default class ItemPopup extends Popup {
  duration = 600;
  delay = 100;

  elementHeight = 0;
  previousTouch = 0;
  moving = false;
  visible = false;
  inTransition = false;

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
  }

  handleOutsideClick(e) {
    this.hide();
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
        this.elementHeight = (window.innerHeight * 9) / 10;
      }

      this.element.style.transition = "0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      this.resize();
      this.inTransition = true;
      setTimeout(() => {
        this.element.style.transition = "0s";
        this.inTransition = false;
      }, 400);
    }
  }

  resize(difference = 0) {
    this.elementHeight -= difference;
    this.element.style.height = `${this.elementHeight}px`;
  }

  showItem(product, item) {
    this.show();
    this.insertContent(product, item);
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

    console.log(product);
  }

  show() {
    if (this.visible || this.inTransition) return;
    this.inTransition = true;
    this.visible = true;
    this.elementHeight = (window.innerHeight * 9) / 10;
    this.resize();
    this.element.animate(this.animation, {
      ...this.options,
      delay: this.delay,
    });
    setTimeout(() => {
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

  get imageZoomPosition() {
    return {
      top: 200,
      left: 100,
      width: 600,
    };
  }
}
