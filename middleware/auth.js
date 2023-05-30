const jwt = require("jsonwebtoken");
const User = require("../models/User");


const auth = async (req, res, next) => {
  try {
    const token = req.cookies.mapscrew;
    console.log(token);

    // Verify the token
    const varifyUser = jwt.verify(
      token,
      "iamranapaulilovealltypeoftechnolodgy"
    );

    const user = await User.findOne({ _id: varifyUser._id });

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.json({
      message: "User is Unauthorized",
    });
  }
};
module.exports = auth;