const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const authCheck = require("../middleware/authCheck");

router.get("/", authCheck, usersController.get_all_users);

router.post("/signup", usersController.user_signup);

router.post("/login", usersController.user_login);

router.get("/:userId", authCheck, usersController.get_user);

router.delete("/:userId", authCheck, usersController.delete_user);

module.exports = router;
