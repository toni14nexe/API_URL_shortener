const express = require("express");
const router = express.Router();
const shortenerController = require("../controllers/shortener");
const authCheck = require("../middleware/authCheck");

// Create new shortener
router.post("/", authCheck, shortenerController.saveShortener);

module.exports = router;
