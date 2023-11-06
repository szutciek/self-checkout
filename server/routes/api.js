import { Router } from "express";

import menuRouter from "./menu.js";
import ingredientRouter from "./ingredients.js";
import userRouter from "./users.js";

const apiRouter = Router();

apiRouter.get("/", (_, res) => {
  res.send("Welcome to the API!");
});

apiRouter.use("/menu", menuRouter);
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
