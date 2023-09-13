import { type } from "express/lib/response";
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: [
    {
      language: {
        type: "String",
        required: true,
      },
      value: {
        type: "String",
        required: true,
      },
    },
  ],
  image: {
    type: "String",
    required: true,
  },
  ingredients: [
    {
      type: String,
    },
  ],
  types: [
    {
      type: String,
    },
  ],
  properties: [
    {
      type: String,
    },
  ],
  allergens: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      name: [
        {
          language: {
            type: "String",
            required: true,
          },
          value: {
            type: "String",
            required: true,
          },
        },
      ],
      price: {
        type: "Number",
        required: true,
      },
      size: {
        type: "String",
        required: true,
      },
    },
  ],
  nutrition: {
    calories: {
      type: "Number",
    },
    fats: {
      type: "Number",
    },
    salt: {
      type: "Number",
    },
    proteins: {
      type: "Number",
    },
    energy: {
      type: "Number",
    },
    sugar: {
      type: "Number",
    },
  },
  nutritionInfo: [
    {
      language: {
        type: "String",
        required: true,
      },
      value: {
        type: "String",
        required: true,
      },
    },
  ],
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
