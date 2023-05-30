const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --------- User Schema ---------

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    minLength: 3,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

// ----------- Generate Tokens ------------
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "iamranapaulilovealltypeoftechnolodgy"
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

//--------------- Hash Password -----------
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// --------- Model ---------
const User = new mongoose.model("User", userSchema);

module.exports = User;