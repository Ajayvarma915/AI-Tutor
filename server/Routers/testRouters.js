const express = require("express");
const testController = require("../Controllers/testController");

const router = express.Router();

router.post("/", testController.scheduleTest);

module.exports = router;
