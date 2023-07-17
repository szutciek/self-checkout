import Window from "./Window.js";
import languages from "../languages.js";

export default class Main extends Window {
  prepared = false;

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

  handleClick = (e) => {
    if (e.target.closest(".menu")) this.handleMenuClick(e);
  };

  handleMenuClick(e) {
    console.log(e);
  }

  updateMenu(menu) {
    if (!menu) return;
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
      el.innerHTML = `
        <img
          src="https://png.pngtree.com/png-vector/20230331/ourmid/pngtree-gourmet-pizza-cartoon-png-image_6656160.png"
          alt="${item.name}"
        />
        <div class="info">
          <p class="name">${item.name}</p>
          <p class="starting">${
            starting[0][0].toUpperCase() + starting[0].slice(1)
          } size for ${starting[1]}PLN</p>
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
