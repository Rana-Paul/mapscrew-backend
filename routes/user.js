const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookiesParser = require("cookie-parser");
router.use(cookiesParser());


//-------------------------
const User = require("../models/User");
//-------------------------
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

//------- Middleware ----------
const auth = require("../middleware/auth");

// --------------- Route ------------

router.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (
    !email ||
    !password ||
    !name ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    res.send({ message: "Name, Email and Password is required" });
  } else {
    const user = await User.findOne({ email: email });
    if (!user) {
      try {
        const registerUser = new User({
          name: name,
          email: email,
          password: password,
        });

        //Generate Token
        const token = await registerUser.generateAuthToken();

        // set jwt in  cookies
        res.cookie("mapscrew", token, {
          withCrdentials: true,
          expires: new Date(Date.now() + 900000),
          httpOnly: false,
        });

        const registered = await registerUser.save();
        res.status(201).send({
          message: "Sucessfully Registered",
        });
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.send({
        message: "User Already Exist",
      });
    }
  }
});

//---------------- Login Route ----------------

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password || email === "" || password === "") {
    res.send({ message: "Email and Password is required" });
  }
  if(req.cookies.mapscrew){
    res.send({ message: "Already loggedin" });

  }
  else {
    const useremail = await User.findOne({ email: email });

    if (useremail) {
      const isMatch = await bcrypt.compare(password, useremail.password);

      if (isMatch) {
        //Generate Token
        const token = await useremail.generateAuthToken();
        console.log(token);

        // set jwt in  cookies
        res.cookie("mapscrew", token, {
          withCrdentials: true,
          expires: new Date(Date.now() + 900000),
          httpOnly: false,
        });

        res.send({
          message: "Login Successfull",
          token: token
        });
      } else {
        res.send({
          message: "Invalid Login  Details",
        });
      }
    } else {
      res.send({
        message: "User Doesn't Exist",
      });
    }
  }
});

//--------- User Logout ----------

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currentToken) => {
      return currentToken.token !== req.token;
    });
    res.clearCookie("mapscrew");
    await req.user.save();
    res.send({ message: "Logout Successfully" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = router;