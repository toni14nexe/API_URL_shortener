const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.post("/signup", usersController.user_signup);

module.exports = router;
