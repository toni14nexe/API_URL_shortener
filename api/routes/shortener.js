const express = require("express");
const router = express.Router();
const shortenerController = require("../controllers/shorteners");
const authCheck = require("../middleware/authCheck");

// Create new shortener
router.post("/", authCheck, shortenerController.saveShortener);

// Get logged user shorteners
router.get("/", authCheck, shortenerController.getLoggedUserShorteners);

// Get logged user shortener by ID
router.get(
  "/:shortenerId",
  authCheck,
  shortenerController.getLoggedUserShortener
);

module.exports = router;
