var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const axios = require("axios");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.get("/receive", (req, res, next) => {
  res.send({
    message: "reply from 3",
  });
});
app.post("/call-to-1", async (req, res, next) => {
  try {
    let { data } = await axios.get(`http://node-1:3000/receive`);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});
app.post("/call-to-2", async (req, res, next) => {
  try {
    let { data } = await axios.get(`http://node-2:3000/receive`);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
