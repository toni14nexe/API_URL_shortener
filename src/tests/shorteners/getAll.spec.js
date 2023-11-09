const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;

describe("Shortener model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Non authorized error", () => {
    axios.get(`${API_link}/shorteners`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 401");
      expect(error.response.data.message).toBe("Authentication failed");
    });
  });
});
