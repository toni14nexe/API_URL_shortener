const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  email: process.env.TEST_USER_EMAIL,
};

describe("User model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Reset password request successfull", () => {
    axios
      .patch(`${API_link}/users/${testUser.email}`)
      .then((response) =>
        expect(response.data.message).toBe(
          "Reset password e-mail sended successfully"
        )
      );
  });

  it("Reset password request successfull", () => {
    axios
      .patch(`${API_link}/users/wrongEmail`)
      .catch((error) =>
        expect(error.response.data.message).toBe(
          "Cannot read properties of null (reading '_id')"
        )
      );
  });
});
