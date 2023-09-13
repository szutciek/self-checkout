import { Router } from "express";
import { readFileSync } from "fs";

import config from "../config.js";

const __root = config.root();

const loadMenu = () => {
  try {
    const menu = JSON.parse(readFileSync(`${__root}data/menu.json`, "utf8"));
    console.log(menu.pl[0]);
    const items = [];
    menu.en.forEach((item) => {
      const lang = "english";
      items[item._id] = item;
      items[item._id].name = [
        {
          language: lang,
          value: item.name,
        },
      ];
    });
    console.log(items);
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
