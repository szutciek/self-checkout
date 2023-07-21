export default class Window {
  #visible = false;
  element = undefined;

  constructor(elementId) {
    try {
      this.elementId = elementId;
      if (!this.elementId) throw new Error("ElementId not defined.");
      this.element = document.getElementById(elementId);
      if (!this.element) throw new Error("Element not found.");
      this.handleCreationGeneral();
    } catch (err) {
      console.warn(`Couldn't create window ${elementId}: ${err.message}`);
    }
  }

  handleCreationGeneral() {
    this.element.style.opacity = 0;
    this.element.style.pointerEvents = "none";
    this.element.classList.remove("hidden");
  }

  forceHide() {
    this.element.style.display = "none";
  }
}
