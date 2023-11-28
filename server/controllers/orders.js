import Order from "../models/Order.js";
import Item from "../models/Item.js";

export const createOrder = async (data, user) => {
  return new Promise(async (res, rej) => {
    try {
      const cart = data.cart;
      if (!cart) throw new Error("Cart not found");
      if (!Array.isArray(cart)) throw new Error("Cart is not an array");

      const promises = cart.map((item) => {
        return new Promise(async (res, rej) => {
          const local = await Item.findOne({ _id: item.id }).select([
            "_id",
            "sizes",
            "price",
          ]);
          if (!local) rej("Item not found");
          res({
            id: local._id,
            size: local.sizes[item.size].sizeKey,
            quantity: item.quantity,
            price: local.sizes[item.size].price,
          });
        });
      });

      const items = await Promise.all(promises);

      const total = items.reduce((acc, item) => {
        return acc + (item.price || 1) * item.quantity;
      }, 0);

      const order = await Order.create({
        user: user.email,
        items,
        date: new Date(),
        status: "pending",
        total,
      });

      res(order);
    } catch (err) {
      if (err.code === 11000) {
        rej({
          type: "ValidationError",
          message: "Duplicate order",
        });
      }
      if (err.name === "ValidationError") {
        rej({
          type: "ValidationError",
          message: "Invalid order data",
        });
      }
    }
  });
};
