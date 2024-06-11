const User = require("../models/User");
const schedule = require("node-schedule");

exports.addUser = async (req, res, next) => {
  try {
    const { date_of_birth, username, email, createdAt } = req.body;

    const newUser = new User({
      date_of_birth,
      username,
      email,
      createdAt,
    });
    const user = await newUser.save();
    return res.status(201).json({
      success: true,
      data: user,
    });
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
