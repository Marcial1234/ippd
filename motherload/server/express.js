var morgan = require("morgan");
var express = require("express");
var mongoose = require("mongoose");
var cloudinary = require("cloudinary");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");

// var uploadFiles = require("./upload/upload");

// Created modules
var vr_api = require("./vr_routes");
var upload_api = require("./upload_routes");

// original dummy code
// var dummy = require("./dummy");
// app.get("/dummy", function(req, res) {
//   res.json(dummy.buildings.IPPD);
// });

module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

  // initialize app
  var app = express();

  // middleware
  app.use(fileUpload());
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({extended: true}));
  // enable request logging for development debugging
  app.use(morgan("dev"));

  // views is directory for all template files
  app.set("views", __dirname + "/../client");
  app.set("view engine", "ejs"); // NOTE THIS - *.html files will not render

  // serve static files
  app.use("/", express.static(__dirname + "/../client"));

  // THIS WAS A BLOCKING ISSUE, mutual dev on two ports available after ~
  app.use((req, res, next) => {
    // TODO LATER: Make this node env var dependent
    // process.env.NODE_ENV?
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    // OMIT Above in PRODUCTION?

    // LEAVE THIS CODE FOR FETCH REQS!!
    if (req.method === "OPTIONS")
      res.sendStatus(200);
    else
      next();
  });

  // File uploading code+routing ~
  app
    .get("/upload", (req, res) => res.render("index", {}))
    .use("/upload", upload_api);

  // ReactVR Routing
  app.use("/vr", (req, res) => {
    res.render("production", {});
  });

  app.use("/api", vr_api);

  // useful for rendering .ejs files in sub-directories
  // app.use("/test", (req, res) => {
  //   res.render(".\\raw-reactvr\\vr\\index", {});
  // });

  // TODO: add random f(x)nality of sending state mappings

  // Wildcard for everything else
  app.use("/*", (req, res) => {
    res.render("index", {});
    // res.redirect("/vr");
  });

  return app;
};
