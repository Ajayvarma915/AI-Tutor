const express = require("express");
const testController = require("../Controllers/testController");

const router = express.Router();

router.post("/", testController.startTest);

module.exports = router;
