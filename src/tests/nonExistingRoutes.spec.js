const axios = require("axios");

const API_link = process.env.API_LINK;

describe("User model test", () => {
  it("Non existing index route", () => {
    axios.get(`${API_link}/wrongRoute`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 404");
      expect(error.response.data.error.message).toBe("Not found");
    });
  });

  it("Non existing user route", () => {
    axios.get(`${API_link}/users/wrongRoute`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 401");
      expect(error.response.data.message).toBe("Authentication failed");
    });
  });

  it("Non existing shortener route", () => {
    axios.get(`${API_link}/shorteners/wrongRoute`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 401");
      expect(error.response.data.message).toBe("Authentication failed");
    });
  });
});
