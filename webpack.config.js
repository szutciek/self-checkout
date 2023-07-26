import path from "path";
import config from "./server/config.js";

const __root = config.root();

export default {
  entry: ["./client/js-s/script.js"],
  output: {
    path: path.join(__root, "client", "dist"),
    filename: "bundle.js",
  },
};
