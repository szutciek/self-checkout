class Station {
  constructor(ws) {
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  authorize(user) {
    this.currentUser = user;
  }
}

export default Station;
