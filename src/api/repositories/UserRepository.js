const User = require("../models/user");
const { errorHandler, responseHandler } = require("../responseHandler");
const emailSender = require("../../modules/nodemailer");
const bcrypt = require("bcrypt");

class UserRepository {
  static async signup(user, response) {
    user
      .save()
      .then(() => {
        bcrypt.hash(user.email, 10, (error, emailHash) => {
          if (error)
            return errorHandler(response, {
              status: 500,
              error: error,
            });
          else {
            emailHash = emailHash.replaceAll("/", "|*+|");
            emailSender.sendValidationEmail(user, emailHash);
            responseHandler(response, 201, {
              user: user,
              hash: emailHash,
            });
          }
        });
      })
      .catch((error) => {
        return errorHandler(response, error);
      });
  }

  static async getUserById(userId, response) {
    try {
      return User.findOne({ _id: userId }).exec();
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async getUserByUsername(username, response) {
    try {
      return User.findOne({ username: username }).exec();
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async getUserByEmail(email, response) {
    try {
      return User.findOne({ email: email }).exec();
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async getAll(response) {
    try {
      return await User.find()
        .select("_id username email role validation")
        .exec();
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async delete(payload, response) {
    try {
      await User.deleteOne({
        _id: payload.userId,
      }).exec();
      responseHandler(response, 200, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async validate(payload, user, response) {
    try {
      await User.updateOne(
        { _id: payload.userId },
        { $set: { validation: true } }
      ).exec();

      const tempEmail = decodeURI(payload.hash);

      bcrypt.compare(
        user.email,
        tempEmail.replaceAll("|*+|", "/"),
        (error, result) => {
          if (error || !result) return errorHandler(response, { status: 401 });
          else {
            responseHandler(response, 200, {
              message: "User is validated successfully",
            });
            emailSender.sendAfterValidationEmail(user._doc);
          }
        }
      );
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async resetPassword(payload, user, hash, response) {
    User.updateOne({ _id: payload.userId }, { $set: { password: hash } })
      .exec()
      .then(() => {
        emailSender.sendAfterPasswordReset(user._doc);
        responseHandler(response, 200, {
          message: "User password changed successfully",
          debt: { ...user._doc },
        });
      })
      .catch((error) => {
        return errorHandler(response, error);
      });
  }
}

module.exports = UserRepository;
