const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const authCheck = require("../middleware/authCheck");

// Get all users
router.get("/", authCheck, UserController.getAll);

// Signup
router.post("/signup", UserController.signup);

// Login
router.post("/login", UserController.signin);

// Get user by ID
router.get("/:userId", authCheck, UserController.get);

// Delete user by ID
router.delete("/:userId", authCheck, UserController.delete);

// Validate user by ID
router.patch("/:userId/:hash", UserController.validate);

// Send reset password email to user by email
router.patch("/:email", UserController.resetPasswordEmail);

// Reset user password by ID
router.put("/:userId/reset-password", UserController.resetPassword);

module.exports = router;
