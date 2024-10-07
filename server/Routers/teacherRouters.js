const express = require("express");
const teacherControllers = require("../Controllers/courseController");
const upload = require("../utils/mutler");

const router = express.Router();

router
  .get("/courses", teacherControllers.getAllCourses)
  .get("/courses/:id", teacherControllers.getCourse)
  .post(
    "/courses/:id/addclassesdetails",
    upload.single("pdffile"),
    teacherControllers.addClassDetails
  );

router.route("/addcourses").post(teacherControllers.addCourses);

module.exports = router;
