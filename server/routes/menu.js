import { Router } from "express";

import { getMenu } from "../controllers/menu.js";

const menuRouter = Router();

menuRouter.get("/", getMenu);

export default menuRouter;
