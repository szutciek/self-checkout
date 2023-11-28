import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: "String",
  },
  items: [
    {
      id: {
        type: "String",
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
  total: {
    type: "Number",
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
