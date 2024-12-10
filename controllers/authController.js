const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
    let token;
    // 1) bech nthabat si el user b3athli token ou bien non ?
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "you are not logged in !!!!",
      });
    }
    // 2) thabat si token valid wala lé

    const decodage = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    console.log(decodage);
    // 3) thabat si el user mizel mawjoud wala lé

    const theUser = await User.findById(decodage.id);

    if (!theUser) {
      return res.status(401).json({
        status: "fail",
        message: "user not found !!!!",
      });
    }

    // 4)  chouf el user badal el pass ba3d ma sna3 token wala lé
    // console.log(theUser.passTimestemp(decodage.iat));
    if (theUser.passTimestemp(decodage.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "token no longer valid !!!!",
      });
    }
    req.user = theUser;
    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.permitMW = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(401).json({
          status: "fail",
          message: "you do not have the permission to do this !!!!",
        });
      }

      next();
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  };
};
