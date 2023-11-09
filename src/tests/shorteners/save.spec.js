const Shortener = require("../../api/models/shortener");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};
let authorizationToken = "";

describe("Shortener model test", () => {
  it("Model exist", () => expect(Shortener).toBeDefined());

  it("Non authorized error", (done) => {
    axios
      .post(`${API_link}/shorteners`, {
        url: "https://test-url.com",
        shortValue: "Test value",
      })
      .catch(() => done());
  });

  it("URL missing first part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "://test-url.com",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (://test-url.com)."
            );
          });
      });
  });

  it("URL missing ':' part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https//test-url.com",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https//test-url.com)."
            );
          });
      });
  });

  it("URL missing '/' part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https:/test-url.com",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https:/test-url.com)."
            );
          });
      });
  });

  it("URL missing '//' part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https:test-url.com",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https:test-url.com)."
            );
          });
      });
  });

  it("URL missing first domain part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://.com",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https://.com)."
            );
          });
      });
  });

  it("URL missing '.' at domain", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://test-urlcom",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https://test-urlcom)."
            );
          });
      });
  });

  it("URL missing last domain part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://test-url.",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https://test-url.)."
            );
          });
      });
  });

  it("URL wrong last domain part", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://test-url.c",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is invalid (https://test-url.c)."
            );
          });
      });
  });

  it("Empty shortener URL", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "",
              shortValue: "Test value",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: url: Path `url` is required."
            );
          });
      });
  });

  it("Too short shortener short value", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://test-url.com",
              shortValue: "ab",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: shortValue: Path `shortValue` (`ab`) is shorter than the minimum allowed length (3)."
            );
          });
      });
  });

  it("Empty shortener short value", () => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: testUser.password,
      })
      .then((response) => {
        authorizationToken = `token ${response.data.user.token}`;

        axios
          .post(
            `${API_link}/shorteners`,
            {
              url: "https://test-url.com",
              shortValue: "",
            },
            {
              headers: {
                Authorization: `${authorizationToken}`,
              },
            }
          )
          .catch((error) => {
            expect(error.response.data.cause).toBe(
              "Shortener validation failed"
            );
            expect(error.response.data.message).toBe(
              "Shortener validation failed: shortValue: Path `shortValue` is required."
            );
          });
      });
  });
});
