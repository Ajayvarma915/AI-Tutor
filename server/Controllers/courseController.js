const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        classes: true,
      },
    });
    res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.addCourses = async (req, res) => {
  const filepath = path.join(__dirname, "../../../New_Resume_Sarath.pdf");
  try {
    const { name, description } = req.body;
    const pdffile = fs.readFileSync(filepath);
    const course = await prisma.Courses.create({
      data: {
        name,
        description,
        classes: {
          create: {
            name: "MERN",
            pdffile: pdffile,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      data: course,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "success",
      message: err,
    });
  }
};
