const prisma = require("../utils/db.config");

exports.StartQuizSession = async (req, res) => {
  try {
    const { classId, userId } = req.body;

    const quizSessoin = await prisma.quizSession.create({
      data: {
        classId,
        userId,
        score: 6,
      },
    });
    res.status(200).json({
      status: "success",
      message: "quiz created",
      data: {
        quizSessoin,
      },
    });
    
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
};
