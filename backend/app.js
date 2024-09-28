var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors");

// Loading configuration variables
dotenv.config({ path: `${__dirname}/config/config.env` });

var categoriesRouter = require("./routes/categories");
var itemsRouter = require("./routes/items");
var suppliersRouter = require("./routes/suppliers");
var ordersRouter = require("./routes/orders");
var usersRouter = require("./routes/users");

// Loading and initializing the MongoDB connection
const { init } = require('./database/index');

// Initialization of the Express application
var app = express();

// Connecting with MongoDB atlas
init().then(() => {
  console.log('Database initialized');
}).catch((error) => {
  console.error('Database initialization error:', error);
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Define the routes
app.use("/auth", usersRouter);
app.use("/categories", categoriesRouter);
app.use("/items", itemsRouter);
app.use("/suppliers", suppliersRouter);
app.use("/orders", ordersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get("env") === "development" ? err : {};

// Render the error page
res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
