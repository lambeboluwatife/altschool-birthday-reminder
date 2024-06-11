const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  date_of_birth: {
    type: String,
    required: [true, "Please enter your date of birth"],
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
