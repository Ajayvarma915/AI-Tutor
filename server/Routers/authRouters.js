const express = require("express");
const authController = require("../Controllers/authController");

const router = express.Router();

router.route("/register").post(authController.Register);
router.route("/login").post(authController.Login);

module.exports = router;
