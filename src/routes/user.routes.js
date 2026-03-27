const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { getProfile } = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", authenticate, getProfile);

module.exports = router;