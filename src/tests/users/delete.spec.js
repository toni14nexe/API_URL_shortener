const Shortener = require("../../api/models/shortener");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  id: process.env.TEST_USER_ID,
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};

describe("Shortener model test", () => {
  it("Model exist", () => expect(Shortener).toBeDefined());

  it("Non authorized error", () => {
    axios.delete(`${API_link}/users/${testUser.id}`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 401");
      expect(error.response.data.message).toBe("Authentication failed");
    });
  });

  it("Wrong user ID", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        axios
          .delete(`${API_link}/users/abcd1234abcd`, {
            headers: {
              Authorization: `token ${response.data.user.token}`,
            },
          })
          .catch((error) => {
            expect(error.message).toBe("Request failed with status code 404");
            expect(error.response.data.message).toBe("Wrong user ID");
          });
      });
  });

  it("Wrong user ID", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        axios
          .delete(`${API_link}/users/`, {
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
