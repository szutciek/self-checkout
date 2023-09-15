import { Router } from "express";
import { readFileSync } from "fs";

import config from "../config.js";

import Item from "../models/Item.js";

const __root = config.root();

const loadMenu = () => {
  try {
    const menu = JSON.parse(readFileSync(`${__root}data/menu.json`, "utf8"));
    const items = {};
    menu.en.forEach((item) => {
      const lang = "english";
      items[item.id] = item;
      items[item.id].name = [
        {
          language: lang,
          value: item.name,
        },
      ];
      Object.entries(item.sizes).forEach(([key, value]) => {
        items[item.id].sizes[key].name = [
          {
            language: lang,
            value: value.name,
          },
        ];
        items[item.id].sizes[key].price = value.price;
        items[item.id].sizes[key].size = value.size;
      });
      items[item.id].nutritionInfo = [
        {
          language: lang,
          value: item.nutritionInfo,
        },
      ];
    });
    menu.pl.forEach((item) => {
      const lang = "polish";
      items[item.id].name.push({
        language: lang,
        value: item.name,
      });
      Object.entries(item.sizes).forEach(([key, value]) => {
        items[item.id].sizes[key].name.push({
          language: lang,
          value: value.name,
        });
      });
      items[item.id].nutritionInfo.push({
        language: lang,
        value: item.nutritionInfo,
      });
      Object.entries(item.nutrition).forEach(([key, value]) => {
        items[item.id].nutrition[key] = Number(
          value.replaceAll("g", "").replaceAll("cal", "")
        );
      });
    });
    Object.values(items).forEach(async (item) => {
      delete item.id;
      item.sizes = Object.entries(item.sizes).map(([key, value]) => {
        return {
          name: value.name,
          price: value.price,
          size: value.size,
          sizeKey: key,
        };
      });
      // const newItem = await Item.create(item);
      // await newItem.save();
    });
    return menu;
  } catch (err) {
    console.log(`Error loading menu: ${err.message}`);
  }
};

const menu = loadMenu();

const menuRouter = Router();

menuRouter.get("/", (req, res) => {
  const language = req.query.language;

  if (!language) {
    res.status(200).json({ menu });
  }
  if (language === "pl") {
    res.status(200).json({
      menu: menu.pl,
    });
  }
  if (language === "en") {
    res.status(200).json({
      menu: menu.en,
    });
  }
});

export default menuRouter;
