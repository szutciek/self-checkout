import stations from "../state/stations.js";

class SocketSender {
  #wss = null;

  constructor(wss) {
    this.#wss = wss;
  }

  broadcast(message) {}

  sendJSON(ws, message) {
    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.log("Count not send message to client");
    }
  }
}

export default SocketSender;
