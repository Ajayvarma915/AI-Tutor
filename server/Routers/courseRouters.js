const express = require("express");
const courseControllers = require("../Controllers/courseController");
const upload = require("../utils/mutler");

const router = express.Router();

router
  .route("/")
  .get(courseControllers.getAllCourses)
  .post(courseControllers.createCourse);

router
  .route("/:id")
  .get(courseControllers.getCourse)
  .patch(upload.single("pdffile"), courseControllers.addClassDetails);



module.exports = router;
