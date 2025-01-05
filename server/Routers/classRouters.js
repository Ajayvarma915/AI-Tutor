const express = require("express");
const classControllers = require("../Controllers/classController");
const router = express.Router();
const upload = require("../utils/mutler");

router
  .route("/")
  .get(classControllers.getAllClasses)
  .post(upload.single("pdffile"), classControllers.createClass);

router
  .route("/:id")
  .get(classControllers.getClass)
  .patch(upload.single("pdffile"), classControllers.updateClass);

  router
  .route("/generateaudio/:id")
  .post(upload.single("pdffile"), classControllers.createAudio);

router.route("/pdf/:id").get(classControllers.getPdf);
router.route("/audio/:id").get(classControllers.getAudio);

// router.route("/streampdf/:id").get(classControllers.streamPdf);
// router.route("/streamaudio/:id").get(classControllers.streamAudio);

module.exports = router;
