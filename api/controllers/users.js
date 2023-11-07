const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../../modules/nodemailer");
const { usersErrorHandling } = require("../errorHandling");

exports.userSignup = (req, res, next) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (passwordRegex.test(req.body.password)) {
    User.find({ username: req.body.username })
      .exec()
      .then((user) => {
        if (user.length)
          return res.status(409).json({ message: "Username already exists" });
        else {
          User.find({ email: req.body.email })
            .exec()
            .then((user) => {
              if (user.length)
                return res
                  .status(409)
                  .json({ message: "Email already exists" });
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
                        bcrypt.hash(user.email, 10, (error, emailHash) => {
                          if (error)
                            return res.status(500).json({ error: error });
                          else {
                            emailHash = emailHash.replaceAll("/", "|*+|");
                            emailSender.sendValidationEmail(user, emailHash);
                            res.status(201).json({
                              message: "User saved successfully",
                              user: user,
                              hash: emailHash,
                            });
                          }
                        });
                      })
                      .catch((error) => usersErrorHandling(error, res));
                  }
                });
              }
            });
        }
      });
  } else
    return res.status(409).json({
      message:
        "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user) {
        if (user.validation) {
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
                { expiresIn: "48h" }
              );
              res.status(200).json({
                message: "Authentication successful",
                user: {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  token: token,
                  createdAt: user.createdAt,
                },
              });
            }
          });
        } else res.status(401).json({ message: "Validate your email first" });
      } else res.status(401).json({ message: "User doesn't exists" });
    })
    .catch((error) => usersErrorHandling(error, res));
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
    .select("_id username email role validation createdAt")
    .exec()
    .then((doc) => {
      if (doc) res.status(200).json(doc);
      else
        res
          .status(404)
          .json({ Message: "No valid entry found for provided ID" });
    })
    .catch((error) => usersErrorHandling(error, res));
};

exports.deleteUser = (req, res, next) => {
  User.findById(req.userData._id)
    .select("_id role")
    .exec()
    .then((doc) => {
      if (doc) {
        if (
          doc.role === "admin" ||
          doc.role === "superadmin" ||
          doc._id == req.userData._id
        ) {
          User.deleteOne({ _id: req.params.userId })
            .exec()
            .then(() =>
              res.status(200).json({
                message: "User deleted successfully",
              })
            )
            .catch((error) => usersErrorHandling(error, res));
        } else
          res.status(404).json({
            message: "Unauthorized error",
          });
      } else
        res.status(404).json({
          message: "Wrong user ID",
        });
    });
};

exports.validateUser = (req, res, next) => {
  User.findById(decodeURI(req.params.userId))
    .select("_id username email role validation createdAt")
    .exec()
    .then((doc) => {
      if (doc._id) {
        User.updateOne(
          { _id: req.params.userId },
          { $set: { validation: true } }
        )
          .exec()
          .then(() => {
            const tempEmail = decodeURI(req.params.hash);
            bcrypt.compare(
              doc.email,
              tempEmail.replaceAll("|*+|", "/"),
              (error, result) => {
                if (error || !result)
                  res.status(401).json({ message: "Unauthorized error" });
                else {
                  res.status(200).json({
                    message: "User is validated successfully",
                    debt: { ...doc._doc, validation: true },
                  });
                  emailSender.sendAfterValidationEmail(doc._doc);
                }
              }
            );
          })
          .catch((error) => usersErrorHandling(error, res));
      } else
        res
          .status(404)
          .json({ Message: "No valid entry found for provided ID" });
    })
    .catch((error) => usersErrorHandling(error, res));
};

exports.resetPasswordEmail = (req, res, next) => {
  User.findOne({ email: req.params.email })
    .select("_id email username")
    .exec()
    .then((doc) => {
      if (doc._id) {
        bcrypt.hash(doc.email, 10, (error, emailHash) => {
          if (error) return res.status(500).json({ error: error });
          else {
            emailHash = emailHash.replaceAll("/", "|*+|");
            emailSender.sendBeforePasswordReset(doc._doc, emailHash);
            res.status(200).json({
              message: "Reset password e-mail sended successfully",
              hash: emailHash,
            });
          }
        });
      } else
        res
          .status(404)
          .json({ Message: "No valid entry found for provided ID" });
    })
    .catch((error) => usersErrorHandling(error, res));
};

exports.resetPassword = (req, res, next) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (passwordRegex.test(req.body.password)) {
    User.findOne({ _id: req.params.userId })
      .select("_id username email validation role")
      .exec()
      .then((doc) => {
        if (doc._id) {
          bcrypt.compare(
            doc.email,
            req.body.hash.replaceAll("|*+|", "/"),
            (error, result) => {
              if (error || !result)
                res.status(401).json({ message: "Unauthorized error" });
              else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                  if (error) return res.status(500).json({ error: error });
                  else {
                    User.updateOne(
                      { _id: req.params.userId },
                      { $set: { password: hash } }
                    )
                      .exec()
                      .then(() => {
                        emailSender.sendAfterPasswordReset(doc._doc);
                        res.status(200).json({
                          message: "User password changed successfully",
                          debt: { ...doc._doc },
                        });
                      })
                      .catch((error) => usersErrorHandling(error, res));
                  }
                });
              }
            }
          );
        } else
          res
            .status(404)
            .json({ Message: "No valid entry found for provided ID" });
      })
      .catch((error) => usersErrorHandling(error, res));
  } else
    return res.status(409).json({
      message:
        "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    });
};
