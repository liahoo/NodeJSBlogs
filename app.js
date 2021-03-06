const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const fileUpload = require('express-fileupload');

const MongoStore = require("connect-mongo")(session);

const connectDB = require("./config/db");

if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: "./config/config.dev.env" });
} else {
    dotenv.config({ path: "./config/config.env" });
}
// Passport config
require("./config/passport")(passport);

// Connect DB
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Morgan for Loggin
if (process.env.NODE_ENV === "development") {
 app.use(morgan("dev"));
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, isStatusMatched } = require("./helpers/hbs");

// Handlebars
app.engine(
 ".hbs",
 exphbs({
  helpers: { formatDate, stripTags, truncate, editIcon, isStatusMatched },
  defaultLayout: "main",
  extname: ".hbs",
 })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
 session({
  secret: "Ruby cat",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
 })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/blogs", require("./routes/blogs"));
app.use("/files", require("./routes/files"));

const PORT = process.env.PORT || 3000;

app.listen(
 PORT,
 console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
