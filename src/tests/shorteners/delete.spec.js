const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testShortenerId = process.env.TEST_SHORTENER_ID;
const testUser = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};

describe("User model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Non authorized error", () => {
    axios.delete(`${API_link}/shorteners/${testShortenerId}`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 401");
      expect(error.response.data.message).toBe("Authentication failed");
    });
  });

  it("Wrong shortener ID", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        axios
          .delete(`${API_link}/shorteners/abcd1234abcd`, {
            headers: {
              Authorization: `token ${response.data.user.token}`,
            },
          })
          .catch((error) => {
            expect(error.message).toBe("Request failed with status code 404");
            expect(error.response.data.message).toBe("Wrong shortener ID");
          });
      });
  });

  it("Empty shortener ID", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        axios
          .delete(`${API_link}/shorteners/`, {
            headers: {
              Authorization: `token ${response.data.user.token}`,
            },
          })
          .catch((error) => {
            expect(error.message).toBe("Request failed with status code 404");
            expect(error.response.data.message).toBe(undefined);
          });
      });
  });
});
