import ClientController from "./ClientController.js";

const client = new ClientController();

await client.setup();
console.log("Station Ready");
