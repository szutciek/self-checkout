import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", (_, res) => {
  res.send("API");
});

apiRouter.get("/assign-station-id", (_, res) => {
  res.json({ stationId: "123" });
});

export default apiRouter;
