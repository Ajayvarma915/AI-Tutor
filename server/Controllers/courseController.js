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
          },
        },
      },
    });

    if (!course || !course.classes) {
      return res.status(404).json({
        status: "fail",
        message: "Course or PDF not found",
      });
    }
    
    const classIds = course.classes.map((item) => item.id);

    const listOfClasses = await prisma.classes.findMany({
      where: {
        id: {
          in: classIds,
        },
        AND: {
          audiofile: null,
        },
      },
      select: {
        id: true,
      },
    });

    const Ids = listOfClasses.map((item)=>item.id)

    course.classes.forEach((item) => {
      console.log(item)
      Ids.find((e)=>e==item.id) ? (item.audio = false) : (item.audio = true);
    });

    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
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

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const deletedCourse = await prisma.courses.delete({
      where: {
        id: courseId,
      },
    });
    res.status(200).json({
      status: "success",
      deletedCourse,
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
