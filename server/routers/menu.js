import { Router } from "express";

import config from "../config.js";

import Item from "../models/Item.js";

const __root = config.root();

const loadMenu = async (language = null) => {
  try {
    const menu = await Item.find();
    const result = {
      en: [],
      pl: [],
    };
    menu.forEach((item) => {
      result.en.push({
        name: item.name.find((lang) => lang.language === "english").value,
        image: item.image,
        ingredients: item.ingredients,
        types: item.types,
        allergens: item.allergens,
        sizes: item.sizes.map((size) => {
          return {
            name: size.name.find((lang) => lang.language === "english").value,
            price: size.price,
            size: size.size,
            sizeKey: size.sizeKey,
          };
        }),
        nutrition: item.nutrition,
        nutritionInfo: item.nutritionInfo.find(
          (lang) => lang.language === "english"
        ).value,
      });
      result.pl.push({
        name: item.name.find((lang) => lang.language === "polish").value,
        image: item.image,
        ingredients: item.ingredients,
        types: item.types,
        allergens: item.allergens,
        sizes: item.sizes.map((size) => {
          return {
            name: size.name.find((lang) => lang.language === "polish").value,
            price: size.price,
            size: size.size,
            sizeKey: size.sizeKey,
          };
        }),
        nutrition: item.nutrition,
        nutritionInfo: item.nutritionInfo.find(
          (lang) => lang.language === "polish"
        ).value,
      });
    });

    if (language === "en") return result.en;
    else if (language === "pl") return result.pl;
    else return result;
  } catch (err) {
    console.log(`Error loading menu: ${err.message}`);
  }
};

const menuRouter = Router();

menuRouter.get("/", async (req, res) => {
  const language = req.query.language;
  const menu = await loadMenu(language);
  res.status(200).json(menu);
});

export default menuRouter;
