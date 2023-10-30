const express = require("express");
const router = express.Router();
const shortenerController = require("../controllers/shortener");
const authCheck = require("../middleware/authCheck");

// Create new shortener
router.post("/", authCheck, shortenerController.saveShortener);

// Get logged user shorteners
router.get("/", authCheck, shortenerController.getLoggedUserShortener);

module.exports = router;
