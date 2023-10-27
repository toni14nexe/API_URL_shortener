const mongoose = require("mongoose");

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: { type: String, default: "user" },
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex,
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);