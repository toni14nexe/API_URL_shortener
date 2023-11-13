const Shortener = require("../models/shortener");
const { errorHandler, responseHandler } = require("../responseHandler");

class ShortenerRepository {
  static async save(payload, response) {
    try {
      const databaseResponse = await payload.save();
      responseHandler(response, 201, { shortener: databaseResponse });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async getAll(payload, response) {
    try {
      const databaseResponse = await Shortener.find({ userId: payload.userId })
        .select("url shortValue createdAt")
        .exec();
      responseHandler(response, 200, {
        total: databaseResponse.length,
        Shortener: databaseResponse,
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async getShortenerById(shortenerId, response) {
    try {
      return await Shortener.findById(shortenerId);
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async update(payload, response, shortener) {
    try {
      await Shortener.updateOne(
        { _id: payload.shortenerId },
        { $set: { url: payload.url, shortValue: payload.shortValue } }
      ).exec();

      responseHandler(response, 200, {
        message: "Shortener changed successfully",
        shortener: {
          ...shortener._doc,
          url: payload.url,
          shortValue: payload.shortValue,
        },
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }

  static async delete(payload, response) {
    try {
      await Shortener.deleteOne({ _id: payload.shortenerId }).exec();
      responseHandler(response, 200, {
        message: "Shortener was deleted successfully",
      });
    } catch (error) {
      return errorHandler(response, error);
    }
  }
}

module.exports = ShortenerRepository;
