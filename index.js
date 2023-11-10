const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("./src/modules/mongoose");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./src/documentation/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
require("dotenv").config({
  path: "./.env",
});

mongoose.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  // TO DO - here set domain to allow CORS
  // change '*' to your domain, for example: 'http://my-page.com'

  res.header("Access-Control-Allow-Origin", process.env.WEB_APP_LINK);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});
// -------- ROUTES FOR METHODS HANDLING -------- //

app.use("/users", require("./src/api/routes/users"));
app.use("/shorteners", require("./src/api/routes/shorteners"));

// --------------------------------------------- //

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error?.message,
    },
  });
});

module.exports = app;
