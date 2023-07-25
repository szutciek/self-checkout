import { WebSocketServer } from "ws";

import config from "./config.js";
import SocketSender from "./models/SocketSender.js";
import stations from "./state/stations.js";

const wss = new WebSocketServer({ port: config.websocketPort });
const socketSender = new SocketSender(wss);

wss.addListener("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const json = JSON.parse(message.toString());
      if (json.type === "registerstation") registerStation(ws);
      if (json.type === "assignSessionId") assignSessionId(ws);
      if (json.type === "authorizeStation") authorizeStation(ws, json);
    } catch (err) {
      console.log(err.message);
    }
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

const authorizeStation = (ws, json) => {
  const stationId = json.stationId;
  const station = stations.getStationBySessionId(stationId);

  if (!station)
    return socketSender.sendJSON(ws, {
      type: "error",
      message: "Station not found. Please scan the QR code again.",
    });

  socketSender.sendJSON(station.ws, {
    type: "userAuthorized",
    user: json.user,
  });
};
