import { Router } from "express";

import menuRouter from "./menu.js";
import ingredientRouter from "./ingredients.js";

const apiRouter = Router();

apiRouter.get("/", (_, res) => {
  res.send("API");
});

apiRouter.use("/menu", menuRouter);
apiRouter.use("/ingredients", ingredientRouter);

apiRouter.get("/assign-station-id", (_, res) => {
  res.json({ stationId: "123" });
});

export default apiRouter;
