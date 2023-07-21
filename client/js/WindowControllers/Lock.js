import Window from "./Window.js";
import languages from "../languages.js";

export default class Lock extends Window {
  duration = 700;

  constructor(elementId, controller) {
    super(elementId);
    this.controller = controller;
    this.handleCreation();
  }

  handleCreation() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.element.addEventListener("click", this.handleClick);
  }
  removeEventListeners() {
    this.element.removeEventListener("click", this.handleClick);
  }

  handleClick = (e) => {
    if (e.target.classList.contains("startOrderButton"))
      this.controller.startOrder();
  };

  hide() {
    const animation = [
      {
        transform: "translateY(0%)",
      },
      {
        transform: "translateY(100%)",
      },
    ];
    const options = {
      duration: this.duration,
      iterations: 1,
      fill: "forwards",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    };
    this.element.animate(animation, options);

    setTimeout(() => {
      this.element.style.pointerEvents = "none";
      this.element.style.opacity = 0;
    }, this.duration);
  }

  show() {
    this.insertContent(this.controller.lang);

    this.element.style.pointerEvents = "auto";
    this.element.style.opacity = 1;

    const animation = [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0%)",
      },
    ];
    const options = {
      duration: this.duration,
      iterations: 1,
      fill: "forwards",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    };
    this.element.animate(animation, options);
  }

  insertContent(lang = this.controller.lang) {
    this.element.querySelector(".startOrderButton").innerHTML =
      languages[lang].start;
  }

  handleLanguageChange() {
    this.insertContent(this.controller.lang);
  }
}
