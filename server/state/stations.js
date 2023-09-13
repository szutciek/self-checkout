import Station from "../classes/Station.js";

class Stations {
  #stations = [];

  constructor() {}

  createStation(ws) {
    const station = new Station(ws);
    this.#stations.push(station);
    return station;
  }

  removeStation(id) {
    this.#stations = this.#stations.filter((station) => station.id !== id);
  }

  getStationById(id) {
    return this.#stations.find((station) => station.id === id);
  }

  getStationBySessionId(id) {
    return this.#stations.find((station) => station.sessionId === id);
  }

  removeStationById(id) {
    this.#stations = this.#stations.filter((station) => station.id !== id);
  }

  get activeStations() {
    return this.#stations;
  }
}

export default new Stations();
