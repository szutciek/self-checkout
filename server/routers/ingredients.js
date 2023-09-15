import { Router } from "express";
import { readFileSync, createReadStream } from "fs";

import config from "../config.js";

const __root = config.root();

const loadIngredients = () => {
  try {
    return JSON.parse(readFileSync(`${__root}data/ingredients.json`, "utf8"));
  } catch (err) {
    console.log(`Error loading ingredients: ${err.message}`);
  }
};

// const ingredients = loadIngredients();

const ingredientsRouter = Router();

ingredientsRouter.get("/", (_, res) => {
  const stream = createReadStream(`${__root}data/ingredients.json`);
  stream.on("data", (chunk) => {
    res.write(chunk);
  });
  stream.on("end", () => {
    res.end();
  });
});

export default ingredientsRouter;
