const User = require("../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const tempPassword = "JestTest1234*";
let testUser = undefined;
let authorization = undefined;
let validationHash = undefined;
let resetPasswordHash = undefined;

describe("User model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("User signup", (done) => {
    axios
      .post(`${API_link}/users/signup`, {
        username: "jestTest",
        email: "jesttesting@test.com",
        password: tempPassword,
        role: "admin",
      })
      .then((response) => {
        testUser = response.data.user;
        validationHash = response.data.hash;
        done();
      });
  });

  it("User validation", (done) => {
    axios
      .patch(`${API_link}/users/${testUser._id}/${validationHash}`)
      .then(() => done());
  });

  it("User login", (done) => {
    axios
      .post(`${API_link}/users/login`, {
        username: testUser.username,
        password: tempPassword,
      })
      .then((response) => {
        testUser = response.data.user;
        authorization = `token ${response.data.user.token}`;
        done();
      });
  });

  it("Get all users", (done) => {
    axios
      .get(`${API_link}/users`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });

  it("Get user", (done) => {
    axios
      .get(`${API_link}/users/${testUser._id}`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });

  it("Reset password email", (done) => {
    axios.patch(`${API_link}/users/${testUser.email}`).then((response) => {
      resetPasswordHash = response.data.hash;
      done();
    });
  });

  it("Reset password", (done) => {
    axios
      .put(`${API_link}/users/${testUser._id}/reset-password`, {
        password: tempPassword,
        hash: resetPasswordHash,
      })
      .then(() => done());
  });

  it("Delete user", (done) => {
    axios
      .delete(`${API_link}/users/${testUser._id}`, {
        headers: {
          Authorization: `${authorization}`,
        },
      })
      .then(() => done());
  });
});
