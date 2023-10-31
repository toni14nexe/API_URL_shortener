const Shortener = require("../api/models/shortener");
const axios = require("axios");

const API_link = "http://localhost:3000";
let authorization = undefined;
let newShoretenerId = undefined;

describe("User model test", () => {
  it("Model exist", () => expect(Shortener).toBeDefined());

  it("Get authorization", (done) => {
    axios
      .post(`${API_link}/users/login`, {
        username: "test1234",
        password: "Test1234*",
      })
      .then((response) => {
        authorization = `token ${response.data.user.token}`;
        done();
      });
  });

  it("Save shortener", (done) => {
    axios
      .post(
        `${API_link}/shorteners`,
        {
          url: "https://test-url.com",
          shortValue: "Test value",
        },
        {
          headers: {
            Authorization: `${authorization}`,
          },
        }
      )
      .then((response) => {
        newShoretenerId = response.data.shortener._id;
        done();
      });
  });

  it("Get logged user shorteners", (done) => {
    axios
      .get(`${API_link}/shorteners`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });

  it("Get shortener by ID", (done) => {
    axios
      .get(`${API_link}/shorteners/${newShoretenerId}`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });
});
