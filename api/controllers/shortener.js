const mongoose = require("mongoose");
const Shortener = require("../models/shortener");

exports.saveShortener = (req, res, next) => {
  const shortener = new Shortener({
    _id: new mongoose.Types.ObjectId(),
    url: req.body.url,
    shortValue: req.body.shortValue,
    userId: req.userData._id,
  });
  shortener
    .save()
    .then(() =>
      res.status(201).json({ message: "Shortener saved successfully" })
    )
    .catch((error) => res.status(500).json({ error: error }));
};