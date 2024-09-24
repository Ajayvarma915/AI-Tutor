const express = require("express");
const teacherControllers = require("../Controllers/courseController");

const router = express.Router();

router.get("/courses", teacherControllers.getAllCourses);

router.route("/addcourses").post(teacherControllers.addCourses);

module.exports = router;
