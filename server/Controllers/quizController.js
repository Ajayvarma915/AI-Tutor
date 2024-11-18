const prisma = require("../utils/db.config");
const axios = require("axios");
const FormData = require("form-data");

exports.StartQuizSession = async (req, res) => {
  try {
    const { classesId, userId, coursesId } = req.body;

    const sendPdf = async () => {
      try {
        const classPdf = await prisma.classes.findFirst({
          where: {
            AND: [
              {
                id: classesId,
              },
              {
                coursesId,
              },
            ],
          },
          select: {
            pdffile: true,
            name: true,
          },
        });
        const formData = new FormData();
        formData.append("file", Buffer.from(classPdf.pdffile), "classes1.pdf");
        const response = await axios.post(
          "http://localhost:9000/pdf_generate-qa/",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );
        console.log(response.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    sendPdf();
    const quizSessoin = await prisma.quizSession.create({
      data: {
        userId,
        classesId,
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
