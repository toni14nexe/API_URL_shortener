const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const authCheck = require("../middleware/authCheck");

router.get("/", authCheck, usersController.getAllUsers);

router.post("/signup", usersController.userSignup);

router.post("/login", usersController.userLogin);

router.get("/:userId", authCheck, usersController.getUser);

router.delete("/:userId", authCheck, usersController.deleteUser);

module.exports = router;
