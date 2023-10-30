const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const authCheck = require("../middleware/authCheck");

// Get all users
router.get("/", authCheck, usersController.getAllUsers);

// Signup
router.post("/signup", usersController.userSignup);

// Login
router.post("/login", usersController.userLogin);

// Get user by ID
router.get("/:userId", authCheck, usersController.getUser);

// Delete user by ID
router.delete("/:userId", authCheck, usersController.deleteUser);

// Validate user by ID
router.patch("/:userId", usersController.validateUser);

module.exports = router;
