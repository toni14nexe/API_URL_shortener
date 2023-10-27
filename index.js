const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({
  path: "./.env",
});

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_LINK}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
