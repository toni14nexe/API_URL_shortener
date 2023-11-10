const mongoose = require("mongoose");
const Shortener = require("../models/shortener");
const { errorHandler, responseHandler } = require("../responseHandler");

class ShortenerController {
  static async save(req, res, next) {
    const shortener = new Shortener({
      _id: new mongoose.Types.ObjectId(),
      url: req.body.url,
      shortValue: req.body.shortValue,
      userId: req.userData._id,
    });

    try {
      const response = await shortener.save();
      responseHandler(res, 201, { shortener: response });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const response = await Shortener.find({ userId: req.userData._id })
        .select("url shortValue createdAt")
        .exec();
      responseHandler(res, 200, {
        total: response.length,
        Shortener: response,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async get(req, res, next) {
    try {
      const response = await Shortener.findById(req.params.shortenerId);
      responseHandler(res, 200, response._doc);
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  static async update(req, res, next) {
    const urlRegex =
      /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*)?(\/\S*)?$/;

    if (urlRegex.test(req.body.url))
      try {
        const response = await Shortener.findOne({
          _id: req.params.shortenerId,
        })
          .select("url shortValue createdAt userId")
          .exec();
        if (!response?._id) return errorHandler(res, { response: 404 });
        if (response.userId !== req.userData._id)
          return errorHandler(res, { status: 401 });
        try {
          await Shortener.updateOne(
            { _id: req.params.shortenerId },
            { $set: { url: req.body.url, shortValue: req.body.shortValue } }
          ).exec();
          responseHandler(res, 200, {
            message: "Shortener changed successfully",
            shortener: {
              ...response._doc,
              url: req.body.url,
              shortValue: req.body.shortValue,
            },
          });
        } catch (error) {
          return errorHandler(res, error);
        }
      } catch (error) {
        return errorHandler(res, error);
      }
    else {
      return errorHandler(res, {
        status: 409,
        message: "URL validation failed",
      });
    }
  }

  static async delete(req, res, next) {
    try {
      const response = await Shortener.findOne({ _id: req.params.shortenerId })
        .select("url shortValue createdAt userId")
        .exec();

      if (!response?._id)
        return errorHandler(res, {
          status: 404,
          message: "Wrong shortener ID",
        });

      if (response.userId !== req.userData._id)
        return errorHandler(res, { status: 401 });
      else {
        await Shortener.deleteOne({ _id: req.params.shortenerId }).exec();
        responseHandler(res, 200, {
          message: "Shortener was deleted successfully",
        });
      }
    } catch (error) {
      return errorHandler(res, error);
    }
  }
}

module.exports = ShortenerController;
