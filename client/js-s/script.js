import ClientController from "./ClientController.js";
const client = new ClientController();
try {
  await client.setup();
} catch (err) {
  console.warn(err);
}
