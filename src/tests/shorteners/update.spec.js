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
    axios
      .put(`${API_link}/shorteners/${testShortenerId}`, {
        url: "http://test-url.com",
        shortValue: "Test value",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 401");
        expect(error.response.data.message).toBe("Authentication failed");
      });
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
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
          .put(
            `${API_link}/shorteners/${testShortenerId}`,
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
            expect(error.response.data.message).toBe("URL validation failed");
            expect(error.response.data.error.status).toBe(409);
          });
      });
  });
});
