export default class Cart {
  #items = [];

  constructor(controller) {
    this.controller = controller;
  }

  addItem(item, quantity = 1) {
    if (!item.id) throw new Error("Can't add item to cart - missing id");
    if (!item.size) throw new Error("Can't add item to cart - missing size");

    const existingItem = this.findItem(item.id, item.size);
    if (existingItem) {
      this.editItemQuantity(
        existingItem.id,
        existingItem.size,
        existingItem.quantity + quantity
      );
      this.controller.cartUpdated();
    } else {
      const newItem = {
        id: item.id,
        size: item.size,
        quantity,
      };
      this.#items.push(newItem);
      this.controller.cartUpdated();
    }
  }

  findItem(id, size) {
    const item = this.#items.find(
      (item) => item.id === id && item.size === size
    );
    if (item) return item;
    return null;
  }

  editItemQuantity(id, size, quantity) {
    if (!id || !size) return;
    const item = this.findItem(id, size);
    if (!item) return;
    this.controller.cartUpdated();
    if (quantity <= 0) return this.removeItem(id);
    item.quantity = quantity;
    return JSON.parse(JSON.stringify(item));
  }

  incrementItemQuantity(id, size) {
    if (!id || !size) return;
    const item = this.findItem(id, size);
    if (!item) return;
    item.quantity++;
    this.controller.cartUpdated();
  }

  reduceItemQuantity(id, size) {
    if (!id || !size) return;
    const item = this.findItem(id, size);
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) {
      this.removeItem(id, size);
    } else {
      this.controller.cartUpdated();
    }
  }

  removeItem(id, size) {
    if (!id || !size) return;
    this.#items = this.#items.filter((item) => {
      if (item.id === id && item.size === size) return false;
      return true;
    });
    this.controller.cartUpdated();
  }

  get checkoutData() {
    return this.#items;
  }

  get items() {
    const list = this.#items.map((item) => {
      const product = this.controller.menu.getProductById(item.id, true);
      if (!product) return;
      const value = {};
      value.product = product;
      value.quantity = item.quantity;
      value.size = item.size;
      value.price = product.sizes[item.size].price;
      return value;
    });
    return list;
  }

  get numberOfItems() {
    return this.#items.length;
  }

  get total() {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }
}
