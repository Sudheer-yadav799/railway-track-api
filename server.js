require("./src/config/env");

const app = require("./src/app");
const config = require("./src/config/env");

app.listen(config.PORT, () => {
  console.log(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  );
});
