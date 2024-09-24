const express = require("express");
const teacherRoutes = require("./Routers/teacherRouters");

const app = express();

app.use(express.json());

app.use("/api/v1/teacher", teacherRoutes);
// app.use("/api/v1/student");

module.exports = app;
