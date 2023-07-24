import { Router } from "express";
import { readFileSync } from "fs";

import config from "../config.js";

const __root = config.root();

const loadIngredients = () => {
  try {
    return JSON.parse(readFileSync(`${__root}data/ingredients.json`, "utf8"));
  } catch (err) {
    console.log(`Error loading ingredients: ${err.message}`);
  }
};

const ingredients = loadIngredients();

const ingredientsRouter = Router();

ingredientsRouter.get("/", (req, res) => {
  const language = req.query.language;

  if (!language) {
    res.status(200).json({ ingredients });
  }
  if (language === "pl") {
    res.status(200).json({
      ingredients: ingredients.pl,
    });
  }
  if (language === "en") {
    res.status(200).json({
      ingredients: ingredients.en,
    });
  }
});

export default ingredientsRouter;
