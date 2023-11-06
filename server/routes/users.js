import { Router } from "express";

import { createUser, loginUser } from "../controllers/users.js";

const userRouter = Router();

userRouter.get("/", (_, res) => {
  res.send("Welcome to the API!");
});

userRouter.post("/", createUser);

userRouter.post("/login", loginUser);

export default userRouter;
