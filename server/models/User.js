import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    unique: true,
    required: true,
  },
  password: {
    type: "String",
  },
  allergies: [
    {
      name: {
        type: "String",
      },
      severity: {
        type: "String",
        enum: ["mild", "moderate", "severe"],
      },
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  balance: {
    type: "Number",
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
