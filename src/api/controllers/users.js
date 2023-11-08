const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../../../modules/nodemailer");
const { errorHandler, responseHandler } = require("../responseHandler");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

class UserController {
  static async signup(req, res, next) {
    if (passwordRegex.test(req.body.password)) {
      try {
        let user = await User.find({ username: req.body.username }).exec();
        if (user.length)
          return errorHandler(res, {
            status: 409,
            message: "Username already exists",
          });

        user = await User.find({ email: req.body.email }).exec();
        if (user.length)
          return errorHandler(res, {
            status: 409,
            message: "Email already exists",
          });

        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) return errorHandler(res, { status: 409, error: error });
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
                    return errorHandler(res, { status: 500, error: error });
                  else {
                    emailHash = emailHash.replaceAll("/", "|*+|");
                    emailSender.sendValidationEmail(user, emailHash);
                    responseHandler(res, 201, {
                      user: user,
                      hash: emailHash,
                    });
                  }
                });
              })
              .catch((error) => {
                return errorHandler(res, error);
              });
          }
        });
      } catch (error) {
        return errorHandler(res, error);
      }
    } else
      return errorHandler(res, {
        status: 409,
        message:
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character",
      });
  }

  static async signin(req, res, next) {
    try {
      const user = await User.findOne({ username: req.body.username }).exec();

      if (!user)
        return errorHandler(res, {
          status: 401,
          message: "User doesn't exists",
        });

      if (!user.validation)
        return errorHandler(res, {
          status: 401,
          message: "Validate your email first",
        });

      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error || !result)
          errorHandler(res, {
            status: 401,
            message: "Authentication failed",
          });
        else {
          const token = jwt.sign(
            {
              _id: user._id,
              username: user.username,
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "48h" }
          );
          responseHandler(res, 200, {
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
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const response = await User.find()
        .select("_id username email role validation")
        .exec();

      responseHandler(res, 200, {
        total: response.length,
        Users: response,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async get(req, res, next) {
    try {
      const response = await User.findById(req.params.userId)
        .select("_id username email role validation createdAt")
        .exec();

      if (!response)
        return errorHandler(res, {
          status: 404,
          message: "No valid entry found for provided ID",
        });

      responseHandler(res, 200, response._doc);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = await User.findById(req.params.userId)
        .select("_id role")
        .exec();

      if (!user)
        return errorHandler(res, { status: 404, message: "Wrong user ID" });

      if (
        user.role === "admin" ||
        user.role === "superadmin" ||
        user._id == req.userData._id
      ) {
        await User.deleteOne({
          _id: req.params.userId,
        }).exec();
        responseHandler(res, 200, {
          message: "User deleted successfully",
        });
      } else errorHandler(res, { status: 401 });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async validate(req, res, next) {
    try {
      const user = await User.findById(decodeURI(req.params.userId))
        .select("_id username email role validation createdAt")
        .exec();

      if (!user?._id)
        return errorHandler(res, {
          status: 404,
          message: "No valid entry found for provided ID",
        });

      await User.updateOne(
        { _id: req.params.userId },
        { $set: { validation: true } }
      ).exec();

      const tempEmail = decodeURI(req.params.hash);
      bcrypt.compare(
        user.email,
        tempEmail.replaceAll("|*+|", "/"),
        (error, result) => {
          if (error || !result) return errorHandler(res, { status: 401 });
          else {
            responseHandler(res, 200, {
              message: "User is validated successfully",
            });
            emailSender.sendAfterValidationEmail(user._doc);
          }
        }
      );
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async resetPasswordEmail(req, res, next) {
    try {
      const user = await User.findOne({ email: req.params.email })
        .select("_id email username")
        .exec();

      if (!user._id)
        return errorHandler(res, {
          status: 404,
          message: "No valid entry found for provided user",
        });

      bcrypt.hash(user.email, 10, (error, emailHash) => {
        if (error) errorHandler(res, { status: 500, error: error });
        else {
          emailHash = emailHash.replaceAll("/", "|*+|");
          emailSender.sendBeforePasswordReset(user._doc, emailHash);
          return responseHandler(res, 200, {
            message: "Reset password e-mail sended successfully",
            hash: emailHash,
          });
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async resetPassword(req, res, next) {
    if (passwordRegex.test(req.body.password)) {
      try {
        const user = await User.findById(req.params.userId)
          .select("_id username email validation role")
          .exec();

        if (!user._id)
          return errorHandler(res, {
            status: 404,
            message: "No valid entry found for provided ID",
          });

        bcrypt.compare(
          user.email,
          req.body.hash.replaceAll("|*+|", "/"),
          (error, result) => {
            if (error || !result) return errorHandler(res, { status: 401 });
            else {
              bcrypt.hash(req.body.password, 10, (error, hash) => {
                if (error)
                  return errorHandler(res, { status: 500, error: error });
                else {
                  User.updateOne(
                    { _id: req.params.userId },
                    { $set: { password: hash } }
                  )
                    .exec()
                    .then(() => {
                      emailSender.sendAfterPasswordReset(user._doc);
                      responseHandler(res, 200, {
                        message: "User password changed successfully",
                        debt: { ...user._doc },
                      });
                    })
                    .catch((error) => {
                      return errorHandler(res, error);
                    });
                }
              });
            }
          }
        );
      } catch (error) {
        return errorHandler(res, error);
      }
    }
  }
}

module.exports = UserController;
