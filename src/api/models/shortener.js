const mongoose = require("mongoose");

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*)?(\/\S*)?$/;

const shortenerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: { type: String, required: true, match: urlRegex },
  shortValue: { type: String, required: true, minLength: 3 },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shortener", shortenerSchema);
