const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const morgan = require("morgan");

const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(express.json());

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("hello");
});

app.all("*", (req, res) => {
  res.status(404).send("404 - route not found");
});

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
