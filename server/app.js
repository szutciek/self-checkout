import Express from "express";

import config from "./config.js";
import "./socket.js";
import apiRouter from "./routers/api.js";

const __root = config.root();

const app = Express();

app.get("/", (_, res) => {
  res.send();
});

app.get("/station-client", (_, res) => {
  res.sendFile(__root + "client/station.html");
});

app.get("/authorize", (_, res) => {
  res.sendFile(__root + "client/user.html");
});

app.use(Express.json());
app.use("/api", apiRouter);

app.use(Express.static(__root + "client"));

app.listen(config.appPort, (err) => {
  if (err) return console.log(err);
  console.log(`Server running on port ${config.appPort}`);
});
