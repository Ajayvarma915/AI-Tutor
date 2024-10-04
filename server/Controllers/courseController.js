const fs = require("fs");
const path = require("path");
const prisma = require("../utils/db.config");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.Courses.findMany({
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

exports.getCourse = async (req, res) => {
  try {
    const courseId = req.params.id * 1;
    console.log(typeof courseId);
    const course = await prisma.Courses.findUnique({
      where: {
        id: courseId,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err,
    });
  }
};

exports.addCourses = async (req, res) => {
  // const filepath = path.join(__dirname, "../../../New_Resume_Sarath.pdf");
  try {
    const { name, description } = req.body;
    // const pdffile = fs.readFileSync(filepath);
    const course = await prisma.Courses.create({
      data: {
        name,
        description,
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

exports.addCoursDetails = async (req, res) => {
  try {
    const { name, pdff, coursid } = req.body;
    const updatedCours = prisma.Courses.update({
      where: {
        id: coursid,
      },
      data: {
        classes: {
          create: {
            name: name,
            pdffile: pdff,
          },
        },
      },
      include: {
        classes: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedCours,
    });
  } catch (err) {
    res.status(303).json({
      status: "failed",
      message: err,
    });
  }
};
