import Window from "./Window.js";
import languages from "../languages.js";

export default class Main extends Window {
  prepared = false;
  duration = 700;

  currentFilter = "popular";

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

  handleOutsideClick(e) {
    console.log("Main", e);
  }

  handleClick = (e) => {
    if (e.target.closest(".menu")) this.handleMenuClick(e);
    this.controller.handleClick(e);
  };

  handleMenuClick(e) {
    if (!e.target.closest(".item")?.dataset.id) return;
    const item = e.target.closest(".item");
    const product = this.findMenuItemById(item.dataset.id);

    this.controller.itemPopup.showItem(product, item);
    // this.handleImageZoom(item);
    console.log(`${product.name} clicked`);
  }

  handleImageZoom(item) {
    const image = item.querySelector("img");
    if (!image) return;

    const initialPos = image.getBoundingClientRect();
    const finalPos = this.controller.itemPopup.imageZoomPosition;

    const imageZoom = image.cloneNode(false);
    imageZoom.classList.add("menuItemPreview");
    imageZoom.style.position = "absolute";
    // document.body.appendChild(imageZoom);

    const animation = [
      {
        top: `calc(${initialPos.top}px + 3rem)`,
        left: `${initialPos.left}px`,
        width: `${initialPos.width}px`,
      },
      {
        top: `${finalPos.top}px`,
        left: `${finalPos.left}px`,
        width: `${finalPos.width}px`,
      },
    ];
    const options = {
      duration: this.duration,
      iterations: 1,
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
    };
    imageZoom.animate(animation, options);

    setTimeout(() => {
      document.body.removeChild(imageZoom);
    }, this.duration);
  }

  findMenuItemById(id) {
    return this.currentMenu.find((item) => item.id === id);
  }

  updateMenu(menu) {
    if (!menu) return;
    this.currentMenu = menu;
    this.prepared = true;

    const menuArea = this.element.querySelector(".menu");
    menuArea.innerHTML = "";
    menu.forEach((item) => {
      let starting = ["", Infinity];
      Object.entries(item.sizes).forEach(([size, details]) => {
        if (details.price < starting[1]) starting = [size, details.price];
      });

      const el = document.createElement("div");
      el.classList.add("item");
      el.dataset.id = item.id;
      el.innerHTML = `
        <img
          src="${item.image}"
          alt="${item.name}"
          class="menuItemPreview"
        />
        <div class="info">
          <p class="name">${item.name}</p>
          <p class="properties">${item.properties
            .map((p) => p.icon)
            .join(" ")}</p>
          <p class="starting">${
            starting[0][0].toUpperCase() + starting[0].slice(1)
          } ${languages[this.controller.lang].items.starting}</p>
          <p class="price">${starting[1]}PLN</p>
        </div>
      `;
      menuArea.appendChild(el);
    });
  }

  show() {
    this.element.style.pointerEvents = "auto";
    this.element.style.opacity = 1;
    this.insertContent(this.controller.lang);
  }

  insertContent(lang) {
    this.insertFilters(lang);
    this.insertHead(lang);
    this.insertLanguages();
  }

  insertFilters(lang = this.controller.lang) {
    const filterArea = this.element.querySelector(".filtersList");
    filterArea.innerHTML = "";
    Object.entries(languages[lang].main.filters).forEach(([key, value]) => {
      const filter = document.createElement("li");
      filter.dataset.filter = key;
      if (this.currentFilter === key) filter.classList.add("active");
      filter.innerHTML = `
        <h2>${value.icon}</h2>
        <p>${value.title}</p>
      `;
      filter.addEventListener("click", this.handleFilterClick);
      filterArea.appendChild(filter);
    });
  }

  insertHead(lang = this.controller.lang) {
    const currentFilter = languages[lang].main.filters[this.currentFilter];
    const headArea = this.element.querySelector(".head .info");
    headArea.innerHTML = `
      <h1>${currentFilter.title}</h1>
      <p>${currentFilter.second}</p>
    `;
  }

  insertLanguages() {
    const languagesArea = this.element.querySelector(".head .languages");
    languagesArea.innerHTML = "";
    Object.values(languages.languages).forEach((lang) => {
      const el = document.createElement("li");
      if (lang.short.toLowerCase() === this.controller.lang)
        el.classList.add("active");
      el.dataset.lang = lang.short.toLowerCase();
      el.innerHTML = `<p>${lang.short.toUpperCase()}</p>`;
      el.addEventListener("click", this.handleLanguageClick);
      languagesArea.appendChild(el);
    });
  }

  handleFilterClick = (e) => {
    const newFilter = e.target.closest("li").dataset.filter;
    if (newFilter === this.currentFilter) return;
    e.target
      .closest("ul")
      .querySelectorAll("li")
      .forEach((filter) => {
        filter.classList.remove("active");
        if (filter.dataset.filter === newFilter) filter.classList.add("active");
      });
    this.currentFilter = newFilter;
    this.insertHead();
  };

  handleLanguageClick = (e) => {
    const newLang = e.target.closest("li").dataset.lang;
    if (!newLang) return;
    this.controller.lang = newLang;
    this.insertLanguages();
  };

  handleLanguageChange() {
    this.insertContent(this.controller.lang);
  }
}
