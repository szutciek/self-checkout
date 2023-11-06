import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { code, name, password, email, allergies } = req.body;
    if (code !== "io3j9382j98efje98") return res.status(403).send("Forbidden");

    const encrypted = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: encrypted,
      email,
      allergies,
    });

    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        fields: [Object.keys(err.keyPattern)[0]],
        error: `${
          Object.keys(err.keyPattern)[0][0].toUpperCase() +
          Object.keys(err.keyPattern)[0].slice(1)
        } already exists`,
      });
    }
    if (err.name === "ValidationError")
      return res.status(400).json(err.message);
    res.status(500).send("Internal server error");
  }
};

export const loginUser = async (req, res) => {
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

    const result = await bcrypt.compare(password, user.password);

    if (result !== true)
      return res.status(401).json({
        fields: ["password"],
        error: "Invalid password",
      });

    const token = jwt.sign({ id: user._id }, "compsciiayey");

    res.status(200).json({
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};
