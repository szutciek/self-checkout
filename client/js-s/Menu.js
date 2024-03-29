import languages from "./languages.js";

export default class Menu {
  #menu = {};

  constructor(menu, ingredients, controller) {
    this.controller = controller;
    if (!menu) throw new Error("Can't create menu - missing menu data");
    this.ingredients = ingredients;
    this.prepareMenu(menu);
  }

  prepareMenu(menu) {
    this.controller.supportedLanguages.forEach((lang) => {
      this.#menu[lang] = this.replaceFieldsData(menu[lang], lang);
    });
  }

  replaceFieldsData(menu, language) {
    return menu.map((item) => {
      item.ingredients = item.ingredients.map(
        (ingredient) => this.ingredients[language][ingredient]
      );
      item.properties = item.properties.map(
        (property) => languages[language].main.properties[property]
      );
      item.nutrition = Object.entries(item.nutrition).map(([key, value]) => {
        const nutrition = languages[language].main.nutrition[key];
        nutrition.value = value;
        return nutrition;
      });

      return item;
    });
  }

  getProductById(id, returnDifferentLanguage = false) {
    let prod = this.#menu[this.lang].find((p) => p.id === id);

    if (!prod) {
      if (returnDifferentLanguage === false) return null;
      let altLang = null;
      this.supportedLanguages.forEach((lang) => {
        if (altLang) return;
        prod = JSON.parse(
          JSON.stringify(this.#menu[lang].find((p) => p.id === id))
        );
        if (prod) altLang = lang;
      });
      if (!altLang) return null;
      prod = JSON.parse(JSON.stringify(prod));
      prod.name = `[${altLang}] ${prod.name}`;
    } else {
      prod = JSON.parse(JSON.stringify(prod));
    }
    return prod;
  }

  get currentMenu() {
    return this.#menu[this.lang];
  }

  updateMenuItems(data) {
    this.#menu = data;
  }

  get allItems() {
    return this.#menu;
  }

  get lang() {
    return this.controller.lang;
  }
  get supportedLanguages() {
    return this.controller.supportedLanguages;
  }
}
