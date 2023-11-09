const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  id: process.env.TEST_USER_ID,
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
  emailHash: process.env.TEST_USER_EMAIL_HASH,
};

describe("User model test", () => {
  it("Model exist", () => {
    expect(User).toBeDefined();
  });

  it("Successfull validation", () => {
    axios
      .patch(`${API_link}/users/${testUser.id}/${testUser.emailHash}`)
      .then((response) => {
        expect(response.data.message).toBe("User is validated successfully");
      });
  });

  it("Wrong user ID", (done) => {
    axios
      .patch(`${API_link}/users/abcd1234abcd/${testUser.emailHash}`)
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 404");
        expect(error.response.data.message).toBe(
          "No valid entry found for provided ID"
        );
      })
      .finally(() => done());
  });

  it("Empty user ID", () => {
    axios.patch(`${API_link}/users//${testUser.emailHash}`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 404");
    });
  });

  it("Wrong hash value", () => {
    axios
      .patch(`${API_link}/users/${testUser.id}/wrongHashValue`)
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(undefined);
      });
  });

  it("Empty hash value", () => {
    axios.patch(`${API_link}/users/${testUser.id}/`).catch((error) => {
      expect(error.message).toBe("Request failed with status code 404");
      expect(error.response.data.message).toBe(
        "Cannot read properties of null (reading '_id')"
      );
    });
  });
});
