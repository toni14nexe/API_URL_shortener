const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../../modules/nodemailer");

exports.userSignup = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length)
        return res.status(409).json({ message: "Username already exists" });
      else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) return res.status(500).json({ error: error });
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
              role: req.body.role,
            });
            user
              .save()
              .then(() => {
                res.status(201).json({ message: "User saved successfully" });
                emailSender.sendValidationEmail(user);
              })
              .catch((error) => res.status(500).json({ error: error }));
          }
        });
      }
    });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (error || !result)
            res.status(401).json({ message: "Authentication failed" });
          else {
            const token = jwt.sign(
              {
                _id: user._id,
                username: user.username,
              },
              process.env.TOKEN_SECRET_KEY,
              { expiresIn: "1h" }
            );
            res.status(200).json({
              message: "Authentication successful",
              user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
              },
            });
          }
        });
      } else res.status(401).json({ message: "User doesn't exists" });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.getAllUsers = (req, res, next) => {
  User.find()
    .select("_id username email role validation")
    .exec()
    .then((docs) => {
      res.status(200).json({
        total: docs.length,
        Users: docs,
      });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .select("_id username email role validation")
    .exec()
    .then((doc) => {
      if (doc) res.status(200).json(doc);
      else
        res
          .status(404)
          .json({ Message: "No valid entry found for provided ID" });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "User was deleted successfully",
      })
    )
    .catch((error) => res.status(500).json({ error: error }));
};

exports.validateUser = (req, res, next) => {
  User.findById(req.params.userId)
    .select("_id username email role validation")
    .exec()
    .then((doc) => {
      if (doc) {
        User.updateOne(
          { _id: req.params.userId },
          { $set: { validation: true } }
        )
          .exec()
          .then(() => {
            res.status(200).json({
              message: "User is validated successfully",
              debt: { ...doc._doc, validation: true },
            });
            emailSender.sendAfterValidationEmail(doc._doc);
          })
          .catch((error) => res.status(500).json({ error: error }));
      } else
        res
          .status(404)
          .json({ Message: "No valid entry found for provided ID" });
    });
};
