import * as url from "url";

export default {
  appPort: 4000,
  websocketPort: 4001,
  root: () => {
    return url.fileURLToPath(new URL("../", import.meta.url));
  },
};
