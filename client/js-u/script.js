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
  document.body.style.backgroundColor = "green";
});

const usernameInput = document.getElementById("usernameInput");

const authorizeButton = document.querySelector("#authorizeStation");
authorizeButton.addEventListener("click", () => {
  document.body.style.backgroundColor = "yellow";

  if (!stationId) return;
  if (usernameInput.value?.length > 3) user.name = usernameInput.value;
  document.body.style.backgroundColor = "red";

  ws.send(JSON.stringify({ type: "authorizeStation", stationId, user }));
});
