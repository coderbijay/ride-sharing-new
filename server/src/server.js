const express = require("express");
const morgan = require("morgan");
const app = express();

const config = require("./config");
const connectDb = require("./db/connection");
const routes = require("./routes");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("api", routes);

module.exports = app.listen(config.app.port, () => {
  console.log(`App is running on http://127.0.0.1:${config.app.port}`);
  connectDb();
});
