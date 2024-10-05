const express = require("express");
const teacherRoutes = require("./Routers/teacherRouters");

const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/teacher", teacherRoutes);
// app.use("/api/v1/student");

module.exports = app;
