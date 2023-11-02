const mongoose = require("mongoose");

const shortenerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: { type: String, required: true, minLength: 5 },
  shortValue: { type: String, required: true, minLength: 3 },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shortener", shortenerSchema);
