import Window from "./Window.js";

export default class Popup extends Window {
  // Customizable variables (these are defaults)
  duration = 600;
  delay = 0;
  clamps = ["px:150", "px:330", "vh:85", "vh:100"];
  defaultClamp = "px:150";
  hideDuration = 400;

  userDraggable = true;

  // Keep the same (require more changes)
  elementHeight = 0;
  previousTouch = 0;
  movementDirection = 0;
  moving = false;
  #visible = false;
  #inTransition = false;
  #openDelay = 0;
  #currentClamp = 2;

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

  constructor(elementId) {
    super(elementId);

    this.elementHeight = this.element.getBoundingClientRect().height;
    this.addEventListeners();
  }

  addEventListeners() {
    this.element.addEventListener("touchstart", this.handleTouch);
    this.element.addEventListener("touchmove", this.handleTouch);
    this.element.addEventListener("touchend", this.handleTouch);
    this.element.addEventListener("touchcancel", this.handleTouch);
  }

  handleTouch = (e) => {
    if (e.type === "touchstart") this.handleParentTouchStart(e);
    if (e.type === "touchmove") this.handleParentTouchMove(e);
    if (e.type === "touchend") this.handleParentTouchEnd(e);
    if (e.type === "touchcancel") this.handleParentTouchEnd(e);
  };

  handleParentTouchStart(e) {
    this.handleTouchStart(e);

    if (this.userDraggable === false) return;
    if (e.target.closest(".move")) this.handleStartMovement(e);
  }

  handleTouchStart() {}

  handleParentTouchMove(e) {
    if (this.moving === true) this.handleMovement(e);
    this.handleTouchMove(e);
  }

  handleTouchMove() {}

  handleParentTouchEnd(e) {
    if (this.moving === true) this.handleEndMovement(e);
    this.handleTouchEnd(e);
  }

  handleTouchEnd() {}

  handleStartMovement(e) {
    const target = e.target.closest(".move");
    if (target && this.#inTransition === false && this.moving === false) {
      e.preventDefault();
      this.previousTouch = e.targetTouches[0].clientY;
      this.moving = true;
    }
  }

  handleMovement(e) {
    if (this.moving === false) return;
    e.preventDefault();
    const touch = e.targetTouches[0];
    this.movementDirection = -Math.sign(touch.clientY - this.previousTouch);
    if (touch.clientY - this.previousTouch > 50) this.movementDirection = -2;
    if (touch.clientY - this.previousTouch < -50) this.movementDirection = 2;
    this.resize(touch.clientY - this.previousTouch);
    this.previousTouch = e.targetTouches[0].clientY;
  }

  handleEndMovement(e) {
    if (this.moving === false) return;
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
    }

    const newClamp = this.determineClamp(direction);
    if (newClamp === -1) return this.hide();
    this.currentClamp = newClamp;
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
    this.#inTransition = true;
    setTimeout(() => {
      this.element.style.transition = "0s";
      this.#inTransition = false;
    }, 300);
  }

  show(useDelay = false) {
    if (this.#visible === true || this.#inTransition === true) return;
    this.#inTransition = true;
    this.#visible = true;
    this.showBase(useDelay);
    this.showSpecific(useDelay);
  }

  showSpecific() {}

  showBase(useDelay) {
    this.currentClamp = 2;
    this.elementHeight = this.translateChangeElementHeight(this.defaultClamp);
    this.resize();
    this.element.animate(this.animation, {
      ...this.options,
      duration: this.duration,
      delay: this.delay,
    });
    let timeout = this.duration;
    if (useDelay === true) timeout += this.delay;
    setTimeout(() => {
      // this.element.style.pointerEvents = "none";
      // this.element.style.opacity = 0;
      this.resize();
      this.#inTransition = false;
      this.controller.popupShown(this.elementId);
    }, timeout);
  }

  hide() {
    if (this.#visible === false || this.#inTransition === true) return;
    this.#inTransition = true;
    this.#visible = false;
    this.hideBase();
    this.hideSpecific();
  }

  hideSpecific() {}

  hideBase() {
    this.element.animate([...this.animation].reverse(), {
      ...this.options,
      delay: 0,
      duration: this.hideDuration,
    });
    setTimeout(() => {
      this.element.style.pointerEvents = "none";
      this.element.style.opacity = 0;
      this.#inTransition = false;
      this.controller.popupHidden(this.elementId);
    }, this.hideDuration);
  }

  outsideChangeClamp(num) {
    this.currentClamp = num;
    this.smoothResize();
  }

  clampChangeFunction() {}

  get currentClamp() {
    return this.#currentClamp;
  }
  set currentClamp(value) {
    this.#currentClamp = value;
    this.elementHeight = this.translateChangeElementHeight(
      this.clamps[this.currentClamp]
    );
    this.clampChangeFunction();
  }

  openDelayChangeFunction() {}

  get openDelay() {
    return this.#openDelay;
  }
  set openDelay(value) {
    this.#openDelay = value;
    this.openDelayChangeFunction();
  }

  get animationDuration() {
    return this.duration;
  }
  get animationDelay() {
    return this.delay + this.#openDelay;
  }

  get visible() {
    return this.#visible;
  }
  set visible(value) {
    console.warn(`Don't set visible directly, use show() and hide() instead!`);
    this.#visible = value;
  }

  get inTransition() {
    return this.#inTransition;
  }
}
