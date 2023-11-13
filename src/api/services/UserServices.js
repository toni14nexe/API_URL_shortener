const User = require("../models/user");
const mongoose = require("mongoose");
const { errorHandler, responseHandler } = require("../responseHandler");
const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailSender = require("../../modules/nodemailer");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

class UserServices {
  static async signup(payload, response) {
    if (!passwordRegex.test(payload.password))
      return errorHandler(response, {
        status: 409,
        message:
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character",
      });

    try {
      let user = await User.find({ username: payload.username }).exec();
      if (user.length)
        return errorHandler(response, {
          status: 409,
          message: "Username already exist",
        });

      user = await User.find({ email: payload.email }).exec();
      if (user.length)
        return errorHandler(response, {
          status: 409,
          message: "Email already exist",
        });

      bcrypt.hash(payload.password, 10, (error, hash) => {
        if (error) return errorHandler(response, { status: 409, error: error });
        else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: payload.username,
            email: payload.email,
            password: hash,
            role: payload.role,
          });

          UserRepository.signup(user, response);
        }
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async signin(payload, response) {
    try {
      const user = await UserRepository.getUserByUsername(
        payload.username,
        response
      );

      if (!user)
        return errorHandler(response, {
          status: 401,
          message: "User doesn't exists",
        });

      if (!user.validation)
        return errorHandler(response, {
          status: 401,
          message: "Validate your email first",
        });

      bcrypt.compare(payload.password, user.password, (error, result) => {
        if (error || !result)
          errorHandler(response, {
            status: 401,
            message: "Authentication failed",
          });
        // Create JWT and send response
        else {
          const token = jwt.sign(
            {
              _id: user._id,
              username: user.username,
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "48h" }
          );
          responseHandler(response, 200, {
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
      return errorHandler(response, error);
    }
  }

  static async getAll(response) {
    try {
      const users = await UserRepository.getAll(response);

      responseHandler(response, 200, {
        total: users.length,
        Users: users,
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async get(payload, response) {
    try {
      const user = await UserRepository.getUserById(payload.userId, response);

      if (!user)
        return errorHandler(response, {
          status: 404,
          message: "No valid entry found for provided ID",
        });

      responseHandler(response, 200, user._doc);
    } catch (error) {
      errorHandler(response, error);
    }
  }

  static async delete(payload, response) {
    try {
      const user = await UserRepository.getUserById(
        payload.requestUserId,
        response
      );

      if (!user)
        return errorHandler(response, {
          status: 404,
          message: "Wrong user ID",
        });

      if (
        user.role === "admin" ||
        user.role === "superadmin" ||
        user._id == payload.requestUserId
      )
        UserRepository.delete(payload, response);
      else errorHandler(response, { status: 401 });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async validate(payload, response) {
    try {
      const user = await UserRepository.getUserById(
        decodeURI(payload.userId),
        response
      );

      if (!user?._id)
        return errorHandler(response, {
          status: 404,
          message: "No valid entry found for provided ID",
        });

      UserRepository.validate(payload, user, response);
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async resetPasswordEmail(payload, response) {
    try {
      const user = await UserRepository.getUserByEmail(payload.email, response);

      if (!user._id)
        return errorHandler(response, {
          status: 404,
          message: "No valid entry found for provided user",
        });

      bcrypt.hash(user.email, 10, (error, emailHash) => {
        if (error) errorHandler(response, { status: 500, error: error });
        else {
          emailHash = emailHash.replaceAll("/", "|*+|");
          emailSender.sendBeforePasswordReset(user._doc, emailHash);
          return responseHandler(response, 200, {
            message: "Reset password e-mail sended successfully",
            hash: emailHash,
          });
        }
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async resetPassword(payload, response) {
    if (!passwordRegex.test(payload.password))
      return errorHandler(response, {
        status: 409,
        message:
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character",
      });

    try {
      const user = await UserRepository.getUserById(payload.userId, response);

      if (!user._id)
        return errorHandler(response, {
          status: 404,
          message: "No valid entry found for provided ID",
        });

      payload.hash = payload.hash.replaceAll("|*+|", "/");

      bcrypt.compare(user.email, decodeURI(payload.hash), (error, result) => {
        if (error || !result) return errorHandler(response, { status: 401 });
        else {
          bcrypt.hash(payload.password, 10, (error, hash) => {
            if (error)
              return errorHandler(response, { status: 500, error: error });
            else UserRepository.resetPassword(payload, user, hash, response);
          });
        }
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }
}

module.exports = UserServices;
