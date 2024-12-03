const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
