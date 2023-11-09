const Shortener = require("../api/models/shortener");
const axios = require("axios");

const API_link = process.env.API_LINK;
const TEST_USER_USERNAME = process.env.TEST_USER_USERNAME;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
let authorization = undefined;
let newShoretenerId = undefined;

describe("User model test", () => {
  it("Model exist", () => expect(Shortener).toBeDefined());

  it("Get authorization", (done) => {
    axios
      .post(`${API_link}/users/login`, {
        username: TEST_USER_USERNAME,
        password: TEST_USER_PASSWORD,
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

  it("Update shortener", (done) => {
    axios
      .put(
        `${API_link}/shorteners/${newShoretenerId}`,
        {
          url: "https://test-url.com.update",
          shortValue: "Test value update",
        },
        {
          headers: {
            Authorization: `${authorization}`,
          },
        }
      )
      .then(() => done());
  });

  it("Delete shortener", (done) => {
    axios
      .delete(`${API_link}/shorteners/${newShoretenerId}`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });
});
