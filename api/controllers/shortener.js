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

exports.getLoggedUserShorteners = (req, res, next) => {
  Shortener.find({ userId: req.userData._id })
    .select("url shortValue")
    .exec()
    .then((docs) => {
      res.status(200).json({
        total: docs.length,
        Shortener: docs,
      });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.getLoggedUserShortener = (req, res, next) => {
  Shortener.findById(req.params.shortenerId)
    .select("url shortValue")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => res.status(500).json({ error: error }));
};
