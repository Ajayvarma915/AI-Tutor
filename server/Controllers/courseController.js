const axios = require("axios");
const prisma = require("../utils/db.config");
const { PassThrough } = require("stream");
const FormData = require("form-data");

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

    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.streamPdf = async (req, res) => {
  try {
    const classesId = parseInt(req.params.id, 10);

    const course = await prisma.classes.findUnique({
      where: {
        id: classesId,
      },
      select: {
        pdffile: true,
        name: true,
      },
    });

    if (!course || !course.pdffile) {
      throw Error("PDF file not Found");
    }

    const pdfBuffer = course.pdffile;

    const readableStream = new PassThrough();
    readableStream.end(pdfBuffer);

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-length": pdfBuffer.length,
    });

    readableStream.pipe(res);
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};

exports.streamAudio = async (req, res) => {
  try {
    const classesId = parseInt(req.params.id, 10);

    const course = await prisma.classes.findUnique({
      where: {
        id: classesId,
      },
      select: {
        audiofile: true,
        name: true,
      },
    });

    if (!course || !course.audiofile) {
      throw Error("PDF file not Found");
    }

    const pdfBuffer = course.audiofile;

    const readableStream = new PassThrough();
    readableStream.end(pdfBuffer);

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-length": pdfBuffer.length,
    });

    readableStream.pipe(res);
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
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

exports.createClass = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfname = req.body.name;
    const classesId = parseInt(req.params.id, 10);

    // const updatedCours = await prisma.Courses.update({
    //   where: {
    //     id: courseId,
    //   },
    //   data: {
    //     classes: {
    //       create: {
    //         name: pdfname,
    //         pdffile: pdfBuffer,
    //         createdAt: new Date(),
    //       },
    //     },
    //   },
    //   include: {
    //     classes: true,
    //   },
    // });

    const pdf = await prisma.classes.findUnique({
      where: {
        id: classesId,
      },
      select: {
        pdffile: true,
        name: true,
      },
    });

    if (!pdf || !pdf.pdffile) {
      return res.status(404).json({
        status: "failed",
        message: "PDF file not found for the given class ID.",
      });
    }

    const formData = new FormData();

    formData.append("file", Buffer.from(pdf.pdffile), pdf.name);

    const resp = await axios.post(
      "http://localhost:9000/generate_mp3/",
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    const audiofileupload = await prisma.classes.update({
      where: {
        id: classesId,
      },
      data: {
        audiofile: Buffer.from(resp.data.audiofile, "base64"),
      },
    });

    res.status(200).json({
      status: "success",
      // data: updatedCours,
      audiofileupload,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
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
        audiofile: true,
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

exports.getPdf = async (req, res) => {
  try {
    const classId = parseInt(req.params.id);

    const pdfData = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
      select: {
        pdffile: true,
      },
    });
    res.status(200).json({
      status: "success",
      pdf: pdfData.pdffile,
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};

exports.getAudio = async (req, res) => {
  try {
    const classId = parseInt(req.params.id, 10);
    const newClass = await prisma.classes.findUnique({
      where: {
        id: classId,
      },
      select: {
        audiofile: true,
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