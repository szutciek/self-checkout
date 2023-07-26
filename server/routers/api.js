import { Router } from "express";

import menuRouter from "./menu.js";
import ingredientRouter from "./ingredients.js";

const apiRouter = Router();

apiRouter.get("/", (_, res) => {
  res.send("Welcome to the API!");
});

apiRouter.use("/menu", menuRouter);
apiRouter.use("/ingredients", ingredientRouter);

export default apiRouter;
