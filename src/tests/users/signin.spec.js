const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};

describe("User model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Username doesn't exist", () => {
    axios
      .post(`${API_link}/users/login`, {
        ...testUser,
        username: "**wrongUsername123**",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("User doesn't exists");
      });
  });

  it("Wrong password", () => {
    axios
      .post(`${API_link}/users/login`, {
        ...testUser,
        username: "wrongPassword",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("User doesn't exists");
      });
  });

  it("Empty username", () => {
    axios
      .post(`${API_link}/users/login`, {
        ...testUser,
        password: "",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("Authentication failed");
      });
  });

  it("Empty password", () => {
    axios
      .post(`${API_link}/users/login`, {
        ...testUser,
        password: "",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("Authentication failed");
      });
  });
});
