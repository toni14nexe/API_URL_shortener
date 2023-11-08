const express = require("express");
const router = express.Router();
const ShortenerController = require("../controllers/shorteners");
const authCheck = require("../middleware/authCheck");

// Create new shortener
router.post("/", authCheck, ShortenerController.save);

// Get logged user shorteners
router.get("/", authCheck, ShortenerController.getAll);

// Get logged user shortener by ID
router.get("/:shortenerId", authCheck, ShortenerController.get);

// Update shortener value by ID
router.put("/:shortenerId", authCheck, ShortenerController.update);

// Delete shortener value by ID
router.delete("/:shortenerId", authCheck, ShortenerController.delete);

module.exports = router;
