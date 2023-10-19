import { Router } from "express";

import User from "../models/User.js";

const userRouter = Router();

userRouter.get("/", (_, res) => {
  res.send("Welcome to the API!");
});

userRouter.post("/", async (req, res) => {
  try {
    const { code, name, password, email, allergies } = req.body;
    if (code !== "io3j9382j98efje98") return res.status(403).send("Forbidden");
    const user = await User.create({ name, password, email, allergies });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json(err.message);
    res.status(500).send("Internal server error");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (typeof name !== "string")
      return res.status(400).json({
        fields: ["password"],
        error: "Invalid username",
      });
    if (typeof password !== "string")
      return res.status(400).json({
        fields: ["password"],
        error: "Invalid password",
      });

    const user = await User.findOne({ name }).select("+password");

    if (!user)
      return res.status(404).json({
        fields: ["name"],
        error: "User not found",
      });

    if (password !== user.password)
      return res.status(401).json({
        fields: ["password"],
        error: "Invalid password",
      });

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

export default userRouter;
