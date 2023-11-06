import { createReadStream } from "fs";

import config from "../config.js";

const __root = config.root();

export const getIngredients = (_, res) => {
  const stream = createReadStream(`${__root}data/ingredients.json`);
  stream.on("data", (chunk) => {
    res.write(chunk);
  });
  stream.on("end", () => {
    res.end();
  });
};
