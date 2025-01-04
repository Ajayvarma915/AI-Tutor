const express = require("express");
const courseControllers = require("../Controllers/courseController");

const router = express.Router();

router
  .route("/")
  .get(courseControllers.getAllCourses)
  .post(courseControllers.createCourse);

router
  .route("/:id")
  .get(courseControllers.getCourse)
  .delete(courseControllers.deleteCourse);

module.exports = router;
