const express = require("express");
const quizController = require("../Controllers/quizController");

const router = express.Router();

router.route("/generate-qa").post(quizController.StartQuizSession);

router.route("/ans-submission").post(quizController.answerSubmission);

router.route("/quizreport/:id").get(quizController.getAllQuizsReport)

module.exports = router;
