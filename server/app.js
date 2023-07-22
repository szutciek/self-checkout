import Express from "express";
import * as url from "url";

import "./socket.js";
import apiRouter from "./routers/api.js";

const __root = url.fileURLToPath(new URL("../", import.meta.url));

const app = Express();

app.get("/", (_, res) => {
  res.send();
});

app.use("/api", apiRouter);

app.get("/station-client", (_, res) => {
  res.sendFile(__root + "client/station.html");
});

app.get("/authorize", (_, res) => {
  res.sendFile(__root + "client/user.html");
});

app.use(Express.static(__root + "client"));

app.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log("Server running on port 3000");
});
