const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // name:String
  name: {
    type: String,
    // required:true
    required: [true, "User name is required !!!"],
    unique: true,
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
