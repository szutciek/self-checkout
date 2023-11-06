import Express from "express";
import mongoose from "mongoose";

import config from "./config.js";
import "./socket.js";
import apiRouter from "./routes/api.js";

const __root = config.root();

mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });

const app = Express();

app.use((_, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

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
