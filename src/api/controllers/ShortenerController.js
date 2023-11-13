const ShortenerServices = require("../services/ShortenerServices");

class ShortenerController {
  static async save(request, response) {
    const payload = {
      url: request.body.url,
      shortValue: request.body.shortValue,
      userId: request.userData._id,
    };
    ShortenerServices.save(payload, response);
  }

  static async getAll(request, response) {
    const payload = {
      userId: request.userData._id,
    };
    ShortenerServices.getAll(payload, response);
  }

  static async get(request, response) {
    const payload = {
      shortenerId: request.params.shortenerId,
    };
    ShortenerServices.get(payload, response);
  }

  static async update(request, response) {
    const payload = {
      url: request.body.url,
      shortValue: request.body.shortValue,
      shortenerId: request.params.shortenerId,
      userId: request.userData._id,
    };
    ShortenerServices.update(payload, response);
  }

  static async delete(request, response) {
    const payload = {
      shortenerId: request.params.shortenerId,
      userId: request.userData._id,
    };
    ShortenerServices.delete(payload, response);
  }
}

module.exports = ShortenerController;
