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

// Update shortener value by ID
router.put("/:shortenerId", authCheck, shortenerController.updateShortener);

// Delete shortener value by ID
router.delete("/:shortenerId", authCheck, shortenerController.deleteShortener);

module.exports = router;
