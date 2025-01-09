const prisma = require("../utils/db.config");
const FormData = require("form-data");
const axios = require("axios");
const { PassThrough } = require("stream");

exports.createClass = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfname = req.file.originalname;
    const courseId = parseInt(req.body.courseId);

    const updatedCours = await prisma.classes.create({
      data: {
        coursesId: courseId,
        name: pdfname,
        pdffile: pdfBuffer,
        createdAt: new Date(),
      },
    });

    const pdf = await prisma.classes.findUnique({
      where: {
        id: updatedCours.id,
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
        id: updatedCours.id,
      },
      data: {
        audiofile: Buffer.from(resp.data.audiofile, "base64"),
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedCours,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const courses = await prisma.classes.findMany({
      select: {
        id: true,
        name: true,
        coursesId: true,
      },
      orderBy: {
        id: "asc",
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

exports.getClass = async (req, res) => {
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

    // To check no of audio file exists
    // const newClass = await prisma.classes.aggregate({
    //   _count: {
    //     _all:true
    //   },
    //   where: {
    //     audiofile: null,
    //   },
    // });

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

exports.updateClass = async (req, res) => {
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

exports.createAudio = async (req, res) => {
  try {
    const classId = parseInt(req.params.id, 10);

    const pdf = await prisma.classes.findUnique({
      where: {
        id: classId,
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
        id: classId,
      },
      data: {
        audiofile: Buffer.from(resp.data.audiofile, "base64"),
      },
    });

    res.status(200).json({
      status: "success",
      data: "updated",
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};

// exports.streamPdf = async (req, res) => {
//   try {
//     const classesId = parseInt(req.params.id, 10);

//     const course = await prisma.classes.findUnique({
//       where: {
//         id: classesId,
//       },
//       select: {
//         pdffile: true,
//         name: true,
//       },
//     });

//     if (!course || !course.pdffile) {
//       throw Error("PDF file not Found");
//     }

//     const pdfBuffer = course.pdffile;

//     const readableStream = new PassThrough();
//     readableStream.end(pdfBuffer);

//     res.writeHead(200, {
//       "Content-Type": "application/pdf",
//       "Content-length": pdfBuffer.length,
//     });

//     readableStream.pipe(res);
//   } catch (e) {
//     res.status(400).json({
//       status: "failed",
//       message: e.message,
//     });
//   }
// };

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
      "Content-Type": "audio/mpeg",
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
