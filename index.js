const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("./modules/mongoose");
require("dotenv").config({
  path: "./.env",
});

mongoose.connect();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // TO DO - here set domain to allow CORS
  // change '*' to your doman, example: 'http://my-page.com'

  res.header("Access-Control-Allow-Orign", "*");
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

app.use("/users", require("./api/routes/users"));
app.use("/shorteners", require("./api/routes/shortener"));

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
