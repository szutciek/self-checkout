import { WebSocketServer } from "ws";

import config from "./config.js";
import SocketSender from "./classes/SocketSender.js";
import stations from "./state/stations.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: config.websocketPort });
const socketSender = new SocketSender(wss);

wss.addListener("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const json = JSON.parse(message.toString());
      if (json.type === "registerstation") return registerStation(ws);
      if (json.type === "assignSessionId") return assignSessionId(ws);
      if (json.type === "authorizeStation") return authorizeStation(ws, json);
      if (json.type === "redirectUser") return redirectUser(ws, json);

      if (json.type === "order") return handleOrder(ws, json);
    } catch (err) {
      console.log(err.message);
    }
  });
  ws.on("close", () => {
    if (ws.stationId) stations.removeStationById(ws.stationId);
  });
});

const registerStation = (ws) => {
  const station = stations.createStation(ws);
  ws.stationId = station.id;
};

const assignSessionId = (ws) => {
  const station = stations.getStationById(ws.stationId);

  if (!station)
    return socketSender.sendJSON(ws, {
      type: "error",
      message: "Station not found",
    });

  const id = station.newSession();
  socketSender.sendJSON(ws, { type: "sessionId", id });
};

const authorizeStation = async (ws, json) => {
  const sessionId = json.sessionId;
  const station = stations.getStationBySessionId(sessionId);

  const decoded = jwt.verify(json.user.token, "compsciiayey");
  const user = await User.findOne({ _id: decoded.id });

  if (!station)
    return socketSender.sendJSON(ws, {
      type: "error",
      message: "Station not found. Please scan the QR code again.",
    });

  station.authorize(json.user, ws);

  socketSender.sendJSON(ws, { type: "userAuthorized" });
  socketSender.sendJSON(station.ws, {
    type: "userAuthorized",
    user: {
      name: user.name,
      email: user.email,
      allergies: user.allergies,
    },
  });
};

const redirectUser = (ws, json) => {
  const stationId = ws.stationId;
  const station = stations.getStationById(stationId);

  if (!station)
    return socketSender.sendJSON(ws, {
      type: "error",
      message: "Station not found.",
    });

  socketSender.sendJSON(station.userWS, {
    type: "redirectUser",
    target: json.target,
  });
};

const handleOrder = (ws, json) => {
  return new Promise(async (res, rej) => {
    try {
      if (!ws.stationId) throw new Error("Station not found");
      await wait(5000);
      throw new Error("Ordering isn't currently allowed. Try again later.");
    } catch (err) {
      console.log(err.message);
      socketSender.sendJSON(ws, { type: "orderFailure", message: err.message });
    }
  });
};

const wait = (ms) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};
