import { Router } from "express";
import { readFileSync } from "fs";

import config from "../config.js";

const __root = config.root();

const loadMenu = () => {
  try {
    return JSON.parse(readFileSync(`${__root}data/menu.json`, "utf8"));
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
