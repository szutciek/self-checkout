import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      size: {
        type: "String",
        required: true,
      },
      quantity: {
        type: "Number",
        required: true,
      },
    },
  ],
  date: {
    type: "Date",
    required: true,
  },
  status: {
    type: "String",
    enum: ["pending", "processing", "accepted", "rejected"],
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
