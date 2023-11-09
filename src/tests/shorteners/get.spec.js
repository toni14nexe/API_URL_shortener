const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testShortenerId = process.env.TEST_SHORTENER_ID;
const testUser = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};
let authorizationToken = "";

describe("Shortener model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Non authorized error", () => {
    axios.get(`${API_link}/shorteners/${testShortenerId}`).catch((error) => {
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
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .get(`${API_link}/shorteners/abcd1234abcd`, {
            headers: {
              Authorization: `${authorizationToken}`,
            },
          })
          .catch((error) => {
            expect(error.message).toBe("Request failed with status code 404");
            expect(error.response.data.message).toBe(
              "Cannot read properties of null (reading '_doc')"
            );
          });
      });
  });

  it("Empty shortener ID", (done) => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .get(`${API_link}/shorteners/`, {
            headers: {
              Authorization: `${authorizationToken}`,
            },
          })
          .then((response) => done());
      });
  });
});
