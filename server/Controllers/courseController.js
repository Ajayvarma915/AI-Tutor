const prisma = require("../utils/db.config");


exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.Courses.findMany({
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
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
    const course = await prisma.Courses.findUnique({
      where: {
        id: courseId,
      },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
            pdffile:true
          },
        },
      },
    });

    if (!course || !course.classes || !course.classes[0].pdffile) {
      return res.status(404).json({
        status: "fail",
        message: "Course or PDF not found",
      });
    }

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

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
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

exports.addClassDetails = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfname = req.body.name;
    const courseId = parseInt(req.params.id, 10);
    const updatedCours = await prisma.Courses.update({
      where: {
        id: courseId,
      },
      data: {
        classes: {
          create: {
            name: pdfname,
            pdffile: pdfBuffer,
            createdAt: new Date(),
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
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classId = parseInt(req.params.id, 10);
    const newClass = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
      select: {
        name: true,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        newClass,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};

exports.updateClassPdf = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfname = req.body.name;
    const classId = parseInt(req.params.id, 10);
    const updatedCours = await prisma.classes.update({
      where: {
        id: classId,
      },
      data: {
        name: pdfname,
        pdffile: pdfBuffer,
        createdAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedCours,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
