const prisma = require("../utils/db.config");
const axios = require("axios");
const FormData = require("form-data");

exports.StartQuizSession = async (req, res) => {
    try {
        const { classesId, userId, coursesId } = req.body;
        const sendPdf = async () => {
            try {
                const classPdf = await prisma.courses.findUnique({
                    where: {
                        id: coursesId,
                    },
                    select: {
                        classes: {
                            where: {
                                id: classesId,
                            },
                            select: {
                                pdffile: true,
                                name: true,
                            },
                        },
                    },
                });

                if (!classPdf || !classPdf.classes || !classPdf.classes[0]) {
                    throw Error("Invalid  class or course data");
                }

                const formData = new FormData();
                formData.append(
                    "file",
                    Buffer.from(classPdf.classes[0].pdffile),
                    classPdf.classes[0].name
                );

                const response = await axios.post(
                    "http://localhost:9000/pdf_generate-qa/",
                    formData,
                    {
                        headers: {
                            ...formData.getHeaders(),
                        },
                    }
                );
                return response.data.question_and_answers.trim();
            } catch (e) {
                console.log(e.message);
                throw new Error(
                    `Failed to fetch PDF or generate questions:${e.message}`
                );
            }
        };

        const createQuizSession = async () => {
            try {
                return await prisma.QuizSession.create({
                    data: {
                        userId:userId,
                        classesId:classesId
                    },
                });
            } catch (e) {
                throw new Error(`Failed to create a new quizSessions : ${e.message}`);
            }
        };

        const updationGeneratedQuestion = async (questions, quizSessionId) => {
            try {
                const finalQuestions = JSON.parse(questions).map((item) => ({
                    ...item,
                    quizSessionId,
                }));

                const updatedFinalQuestions =
                    await prisma.generatedQuestion.createManyAndReturn({
                        data: finalQuestions,
                    });

                return updatedFinalQuestions;
            } catch (e) {
                throw new Error(`Failed to update generated questions: ${e.message}`);
            }
        };

        const generatedQuestion = await sendPdf();
        const quizSession = await createQuizSession();
        const finalQuestionsSet = await updationGeneratedQuestion(
            [generatedQuestion],
            quizSession.id
        );

        res.status(200).json({
            status: "success",
            message: "quiz created",
            data: {
                quizDetail: quizSession,
                generatedQuestions: finalQuestionsSet,
            },
        });
    } catch (e) {
        return res.status(400).json({
            status: "Failed",
            message: e.message,
        });
    }
};

exports.answerSubmission = async (req, res) => {
    try {
        const { quizSessionId, classId, userId, response } = req.body;

    const resultsOfQuiz = async (quizId, res) => {
      try {
        const ansOfQns = await prisma.generatedQuestion.findMany({
          where: {
            quizSessionId: quizId,
          },
          select: {
            id: true,
            correctAnswer: true,
          },
        });
        let count = 0;
        let newRes = res;
        for (let i = 0; i < 10; i++) {
          if (ansOfQns[i].id === res[i].questionId) {
            if (ansOfQns[i].correctAnswer === res[i].answer) {
              count += 1;
              newRes[i].isAnswered = true;
              newRes[i].isCorrect = true;
            } else {
              newRes[i].isAnswered = true;
              newRes[i].isCorrect = false;
            }
          }
        }
        

        await prisma.quizSession.update({
          where:{
            id:quizId
          },
          data:{
            status:"COMPLETED",
            completedAt: new Date(),
            score:count
          }
        })

                await prisma.response.createMany({
                    data: newRes,
                });

                return count;
            } catch (e) {
                throw new Error(`Failed to process the submission ${e.message}`);
            }
        };

        const result = await resultsOfQuiz(quizSessionId, response);

        res.status(200).json({
            status: "success",
            data: {
                user: userId,
                score: result,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "success",
            message: e.message,
        });
    }
};