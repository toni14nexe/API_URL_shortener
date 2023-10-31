const mongoose = require("mongoose");
const Shortener = require("../models/shortener");
const { usersErrorHandling } = require("../errorHandling");

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
      res
        .status(201)
        .json({ message: "Shortener saved successfully", shortener: shortener })
    )
    .catch((error) => usersErrorHandling(error, res));
};

exports.getLoggedUserShorteners = (req, res, next) => {
  Shortener.find({ userId: req.userData._id })
    .select("url shortValue createdAt")
    .exec()
    .then((docs) => {
      res.status(200).json({
        total: docs.length,
        Shortener: docs,
      });
    })
    .catch((error) => usersErrorHandling(error, res));
};

exports.getLoggedUserShortener = (req, res, next) => {
  Shortener.findById(req.params.shortenerId)
    .select("url shortValue createdAt")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => usersErrorHandling(error, res));
};

exports.updateShortener = (req, res, next) => {
  Shortener.findOne({ _id: req.params.shortenerId })
    .select("url shortValue createdAt userId")
    .exec()
    .then((doc) => {
      if (doc._id) {
        if (doc.userId === req.userData._id) {
          Shortener.updateOne(
            { _id: req.params.shortenerId },
            { $set: { url: req.body.url, shortValue: req.body.shortValue } }
          )
            .exec()
            .then(() => {
              res.status(200).json({
                message: "Shortener changed successfully",
                shortener: {
                  ...doc._doc,
                  url: req.body.url,
                  shortValue: req.body.shortValue,
                },
              });
            });
        } else
          res.status(401).json({
            message: "Unauthorized error",
          });
      } else
        res.status(404).json({
          message: "Wrong shortener ID",
        });
    });
};

exports.deleteShortener = (req, res, next) => {
  Shortener.findOne({ _id: req.params.shortenerId })
    .select("url shortValue createdAt userId")
    .exec()
    .then((doc) => {
      if (doc._id) {
        if (doc.userId === req.userData._id) {
          Shortener.deleteOne({ _id: req.params.shortenerId })
            .exec()
            .then((shortener) =>
              res.status(200).json({
                message: "Shortener was deleted successfully",
              })
            )
            .catch((error) => usersErrorHandling(error, res));
        }
      }
    });
};
