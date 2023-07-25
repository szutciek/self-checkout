class Station {
  id = null;
  sessionId = null;
  ws = null;
  currentUser = null;

  constructor(ws) {
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  authorize(user) {
    this.currentUser = user;
  }

  newSession() {
    this.sessionId = crypto.randomUUID();
    return this.sessionId;
  }
}

export default Station;
