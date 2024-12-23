const express = require("express");
const quizController = require("../Controllers/quizController");

const router = express.Router();

router.route("/generate-qa").post(quizController.StartQuizSession);

router.route("/ans-submission").post(quizController.answerSubmission);

module.exports = router;
