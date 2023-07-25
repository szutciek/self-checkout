class Station {
  id = null;
  sessionId = null;
  ws = null;
  currentUser = null;
  userWS = null;

  constructor(ws) {
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  authorize(user, ws) {
    this.currentUser = user;
    this.userWS = ws;
  }

  newSession() {
    this.currentUser = null;
    this.userWS = null;
    this.sessionId = crypto.randomUUID();
    return this.sessionId;
  }
}

export default Station;
