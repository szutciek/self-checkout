import Window from "./Window.js";

export default class Popup extends Window {
  #open = false;

  constructor(elementId) {
    super(elementId);
  }
}
