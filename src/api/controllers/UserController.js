const UserServices = require("../services/UserServices");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

class UserController {
  static async signup(request, response) {
    const payload = {
      username: request.body.username,
      password: request.body.password,
      email: request.body.email,
      role: request.body.role,
    };

    UserServices.signup(payload, response);
  }

  static async signin(request, response) {
    const payload = {
      username: request.body.username,
      password: request.body.password,
    };

    UserServices.signin(payload, response);
  }

  static async getAll(request, response) {
    UserServices.getAll(response);
  }

  static async get(request, response) {
    const payload = {
      userId: request.params.userId,
    };
    UserServices.get(payload, response);
  }

  static async delete(request, response) {
    const payload = {
      userId: request.params.userId,
      requestUserId: request.userData._id,
    };
    UserServices.delete(payload, response);
  }

  static async validate(request, response) {
    const payload = {
      userId: request.params.userId,
      hash: request.params.hash,
    };
    UserServices.validate(payload, response);
  }

  static async resetPasswordEmail(request, response) {
    const payload = {
      email: request.params.email,
    };
    UserServices.resetPasswordEmail(payload, response);
  }

  static async resetPassword(request, response) {
    const payload = {
      password: request.body.password,
      username: request.params.userId,
      hash: request.body.hash,
      userId: request.params.userId,
    };
    UserServices.resetPassword(payload, response);
  }
}

module.exports = UserController;
