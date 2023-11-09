const User = require("../../api/models/user");
const axios = require("axios");

const API_link = process.env.API_LINK;
const testUser = {
  username: "jestTest",
  email: "jesttesting@test.com",
  password: "JestTest1234*",
  role: "admin",
};

describe("User model test", () => {
  it("Model exist", () => expect(User).toBeDefined());

  it("Existing username", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: process.env.TEST_USER_USERNAME,
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("Username already exist");
      });
  });

  it("Empty username", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "",
        email: "**nonExistingEmail123**",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: username: Path `username` is required., email: Path `email` is invalid (**nonExistingEmail123**)."
        );
      });
  });

  it("Existing email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: process.env.TEST_USER_EMAIL,
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe("Email already exist");
      });
  });

  it("Missing first part of email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "@mail.com",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (@mail.com)."
        );
      });
  });

  it("Missing @ at email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "testmail.com",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (testmail.com)."
        );
      });
  });

  it("Missing second part of email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "test@.com",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (test@.com)."
        );
      });
  });

  it("Missing dot (.) at email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "test@mailcom",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (test@mailcom)."
        );
      });
  });

  it("Missing third part of email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "test@mail.",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (test@mail.)."
        );
      });
  });

  it("wrong third part of email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername123**",
        email: "test@mail.c",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is invalid (test@mail.c)."
        );
      });
  });

  it("Empty email", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        username: "**nonExistingUsername**",
        email: "",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "User validation failed: email: Path `email` is required."
        );
      });
  });

  it("Too short password", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        password: "Abc123*",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      });
  });

  it("Password without special character", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        password: "Abcd1234",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      });
  });

  it("Password without capital letter", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        password: "abcd1234*",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      });
  });

  it("Password without lowercase letter", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        password: "ABCD1234*",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      });
  });

  it("Empty password", () => {
    axios
      .post(`${API_link}/users/signup`, {
        ...testUser,
        password: "",
      })
      .catch((error) => {
        expect(error.message).toBe("Request failed with status code 409");
        expect(error.response.data.message).toBe(
          "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      });
  });
});
