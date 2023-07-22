import stations from "../state/stations.js";

class SocketSender {
  #wss = null;

  constructor(wss) {
    this.#wss = wss;
  }

  broadcast(message) {}

  sendJSON(ws, message) {
    ws.send(JSON.stringify(message));
  }
}

export default SocketSender;
