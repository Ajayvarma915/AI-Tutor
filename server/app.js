const express = require("express");
const courseRouters = require("./Routers/courseRouters");
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

app.use("/api/v1/courses", courseRouters);
app.use("/api/v1/users", authRouters);

module.exports = app;
