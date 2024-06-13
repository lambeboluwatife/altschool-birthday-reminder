const User = require("../models/User");
const moment = require("moment");

exports.addUser = async (req, res, next) => {
  try {
    const { username, email, date_of_birth, createdAt } = req.body;

    const newUser = new User({
      date_of_birth,
      username,
      email,
      createdAt,
    });
    const user = await newUser.save();
    res.status(201).redirect("/");
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
};
