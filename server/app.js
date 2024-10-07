const express = require("express");
const teacherRoutes = require("./Routers/teacherRouters");
const authRouters = require("./Routers/authRouters");

const morgan = require("morgan");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:8000",
  methods: "GET, POST, PUT, DELETE",
  credential: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/users", authRouters);

module.exports = app;
