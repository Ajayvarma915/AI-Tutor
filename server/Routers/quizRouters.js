const express = require("express");
const quizController = require("../Controllers/quizController");

const router = express.Router();

router.route("/generate-qa").get(quizController.StartQuizSession);

module.exports = router;
