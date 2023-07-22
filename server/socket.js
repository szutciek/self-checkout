import { WebSocketServer } from "ws";

import config from "./config.js";
import SocketSender from "./models/SocketSender.js";
import stations from "./state/stations.js";

const wss = new WebSocketServer({ port: config.websocketPort });
const socketSender = new SocketSender(wss);

wss.addListener("connection", (ws) => {
  ws.on("message", (message) => {
    const json = JSON.parse(message.toString());
    if (json.type === "registerstation") registerStation(ws);
    if (json.type === "authorizeStation") authorizeStation(ws, json);
  });
});

const registerStation = (ws) => {
  const station = stations.createStation(ws);
  socketSender.sendJSON(ws, { type: "stationid", id: station.id });
};

const authorizeStation = (ws, json) => {
  const stationId = json.stationId;
  const station = stations.getStationById(stationId);
  if (station == undefined) {
    socketSender.sendJSON(ws, { type: "error", message: "Station not found" });
  } else {
    socketSender.sendJSON(station.ws, {
      type: "userAuthorized",
      user: json.user,
    });
  }
};
