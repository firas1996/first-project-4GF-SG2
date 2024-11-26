const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required !!!"],
  },
  email: {
    type: String,
    required: [true, "Email is required !!!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Set a valid email !!!!"],
  },
  password: {
    type: String,
    required: [true, "Password is required !!!"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Password is required !!!"],
    minlength: 8,
    validate: {
      validator: function (cPass) {
        return cPass === this.password;
      },
      message: "Password doas not match !!!",
    },
  },
  role: {
    type: String,
  },
  age: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
