export default class Window {
  #visible = false;
  #element = undefined;

  constructor(elementId) {
    try {
      if (!elementId) throw new Error("ElementId not defined.");
      this.#element = document.getElementById(elementId);
      if (!this.#element) throw new Error("Element not found.");
      console.log("Window constructor ran successfully");
    } catch (err) {
      console.warn(`Couldn't create window ${elementId}: ${err.message}`);
    }
  }

  forceHide() {
    this.#element.style.display = "none";
  }
}
