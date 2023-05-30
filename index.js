require("./db/db");
const express = require("express");
const app = express();
app.use(express.json());
const userRoute = require("./routes/user");

// ----------- CORS ------------
const cors = require('cors');
app.use(cors({
  origin:["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

//------- Cookies Parser ----------
const cookiesParser = require("cookie-parser");
app.use(cookiesParser());

//------- Middleware ----------
const auth = require("./middleware/auth");

// -------- Routes ---------
app.use("/user", userRoute);

app.post("/home", auth, (req, res) => {
  res.status(200).json({
    message: "Home Page",
  });
});
app.use((req, res, next) => {
  res.status(200).json({
    message: "Route is not found",
  });
});

module.exports = app;