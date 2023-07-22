import config from "./config.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const stationId = urlParams.get("stationId");

const user = {
  name: "Test User",
};

const ws = new WebSocket(config.wsUrl);

ws.addEventListener("open", () => {
  console.log("Connection to server open");
});

const authorizeButton = document.querySelector("#authorizeStation");
authorizeButton.addEventListener("click", () => {
  if (!stationId) return;
  ws.send(JSON.stringify({ type: "authorizeStation", stationId, user }));
});
