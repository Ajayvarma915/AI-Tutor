const prisma = require("../utils/db.config");

exports.scheduleTest = async (req, res) => {
  try {
    const { courseId, startTime, endTime, testType } = req.body;

    const scheduleTest = await prisma.exam.create({
      data: {
        coursesId: courseId,
        testType: testType,
        startTime: startTime,
        endTime: endTime,
      },
    });
    
    res.status(200).json({
      status: "success",
      scheduleTest,
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
