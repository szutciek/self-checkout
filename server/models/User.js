import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
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
});

const User = mongoose.model("User", userSchema);

export default User;
