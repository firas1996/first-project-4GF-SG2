const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, age } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role,
      age,
    });
    const token = createToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email | !password) {
      return res.status(400).json({
        status: "fail",
        message: "email and the password are missing",
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPass(password, user.password))) {
      return res.status(400).json({
        status: "fail",
        message: "email or password are not valid",
      });
    }
    const token = createToken(user._id);
    res.status(200).json({
      status: "success",
      message: "logged in",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.protectorMW = async (req, res, next) => {
  try {
    // 1)

    // 2)

    // 3)

    // 4)

    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
