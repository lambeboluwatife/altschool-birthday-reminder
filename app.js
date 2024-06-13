const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const morgan = require("morgan");
const schedule = require("node-schedule");
const moment = require("moment");
const nodemailer = require("nodemailer");

const User = require("./models/User");

const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(express.json());

// EJS
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const users = require("./routes/users");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendBirthdayEmails = async () => {
  try {
    const users = await User.find();

    const today = new Date();

    users.forEach((user) => {
      const userBirthday = moment(user.date_of_birth).format("MMMM D");
      const todayBirthday = moment(today).format("MMMM D");

      if (userBirthday === todayBirthday) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Happy Birthday ${user.username}!`,
          text: `Happy Birthday ${user.username}!. We wish you a happy birthday, more wins and accomplishment. From Altschool.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(`Error sending email to ${user.email}`, error);
          } else {
            console.log(`Email sent to ${user.email}`, info.response);
          }
        });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

schedule.scheduleJob("43 16 * * *", () => {
  console.log("Running birthday email job...");
  sendBirthdayEmails();
});

app.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).render("home", { users: users });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

app.use("/users", users);

app.all("*", (req, res) => {
  res.status(404).send("404 - route not found");
});

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
