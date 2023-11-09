const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  id: process.env.TEST_USER_ID,
  password: process.env.TEST_USER_RESET_PASSWORD,
  hash: process.env.TEST_USER_RESET_PASSWORD_HASH,
};

describe("User model test", () => {
  it("Model exist", () => {
    expect(User).toBeDefined();
  });

  it("Too short password", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: "Abc123*",
        hash: testUser.hash,
      })
      .catch((error) => {
        expect(error.response.status).toBe(409);
        done();
      });
  });

  it("Wrong hash value", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: testUser.password,
        hash: "wrongHadhValue",
      })
      .catch(() => done());
  });

  it("Password without special character", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: "Abcd1234",
        hash: testUser.hash,
      })
      .catch((error) => {
        expect(error.response.status).toBe(409);
        done();
      });
  });

  it("Password without capital letter", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: "abcd1234*",
        hash: testUser.hash,
      })
      .catch((error) => {
        expect(error.response.status).toBe(409);
        done();
      });
  });

  it("Password without lowercase letter", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: "ABCD1234*",
        hash: testUser.hash,
      })
      .catch((error) => {
        expect(error.response.status).toBe(409);
        done();
      });
  });

  it("Empty password", (done) => {
    axios
      .patch(`${API_link}/users/${testUser.id}/reset-password`, {
        password: "",
        hash: testUser.hash,
      })
      .catch((error) => {
        expect(error.response.status).toBe(409);
        done();
      });
  });
});
