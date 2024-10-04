const express = require("express");
const teacherControllers = require("../Controllers/courseController");

const router = express.Router();

router
  .get("/courses", teacherControllers.getAllCourses)
  .get("/courses/:id", teacherControllers.getCourse);

router.route("/addcourses").post(teacherControllers.addCourses);
router.route("/addcourdetails").post(teacherControllers.addCoursDetails);

module.exports = router;
