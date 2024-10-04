var express = require("express");
var router = express.Router();
const controller = require("../controllers/activities");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.getAllActivities);

module.exports = router;