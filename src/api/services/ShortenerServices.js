const Shortener = require("../models/shortener");
const mongoose = require("mongoose");
const ShortenerRepository = require("../repositories/ShortenerRepository");
const { errorHandler, responseHandler } = require("../responseHandler");

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*)?(\/\S*)?$/;

class ShortenerServices {
  static async save(payload, response) {
    const shortener = new Shortener({
      _id: new mongoose.Types.ObjectId(),
      url: payload.url,
      shortValue: payload.shortValue,
      userId: payload.userId,
    });
    ShortenerRepository.save(shortener, response);
  }

  static async getAll(payload, response) {
    ShortenerRepository.getAll(payload, response);
  }

  static async get(payload, response) {
    try {
      const shortener = await ShortenerRepository.getShortenerById(
        payload.shortenerId,
        response
      );
      responseHandler(response, 200, shortener._doc);
    } catch (error) {}
  }

  static async update(payload, response) {
    if (!urlRegex.test(payload.url))
      return errorHandler(response, {
        status: 409,
        message: "URL validation failed",
      });

    // Get shortener data
    try {
      const shortener = await Shortener.findOne({
        _id: payload.shortenerId,
      })
        .select("url shortValue createdAt userId")
        .exec();

      if (!shortener?._id) return errorHandler(response, { shortener: 404 });

      if (shortener.userId !== payload.userId)
        return errorHandler(response, { status: 401 });

      ShortenerRepository.update(payload, response, shortener);
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async delete(payload, response) {
    try {
      const shortener = await ShortenerRepository.getShortenerById(
        payload.shortenerId,
        response
      );

      if (!shortener?._id)
        return errorHandler(response, {
          status: 404,
          message: "Wrong shortener ID",
        });

      if (shortener.userId !== payload.userId)
        return errorHandler(response, { status: 401 });

      ShortenerRepository.delete(payload, response);
    } catch (error) {
      return errorHandler(response, error);
    }
  }
}

module.exports = ShortenerServices;
