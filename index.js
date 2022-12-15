require("dotenv").config();
const passport=require('passport');
// const bcrypt=require('bcryptjs');
const compression = require('compression');

let express = require("express");
let bodyParser = require("body-parser");
let http = require("http");
let path = require("path");
let exphbs = require("express-handlebars");
let cors = require("cors");
let nLog = require("noogger");

// Init App
var app = express();
// compress all responses
app.use(compression());
var server = http.createServer(app);

// logger configurations
var nlogParams = {
  consoleOutput: true,
  consoleOutputLevel: "DEBUG",
  dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
  fileNameDateFormat: "YYYY-MM-DD",
  fileNamePrefix: "cl-",
  outputPath: "logs/"
};
nLog.init(nlogParams);

//Use CORS
app.use(cors());


//passport Middelware
// app.use(passport.initialize());
// app.use(passport.session());

// require('./config/passport')(passport);

// Use body-parser to get POST requests for API use
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);

// Routes setup
let publicRoutes = require("./routes/public");
let apiRoutes = require("./routes/api");


app.use("/api", apiRoutes);
app.use("/", publicRoutes);

// View Engine
app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "layout"
  })
);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 80);

server.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
