var morgan = require("morgan");
var express = require("express");
var mongoose = require("mongoose");
var cloudinary = require("cloudinary");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");

// Created modules
var dummy = require("./dummy.js");
var uploadFiles = require("./upload/upload.js");

module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

  // initialize app
  var app = express();

  // enable request logging for development debugging
  app.use(morgan("dev"));

  // middleware
  app.use(fileUpload());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // views is directory for all template files
  app.set("views", __dirname + "/../client");
  app.set("view engine", "ejs");

  // serve static files
  app.use("/", express.static(__dirname + "/../client"));

  // TODO soon: move to express router ~

  // File uploading code+routing ~
  app.get("/upload", function(req, res) {
    res.render("upload", {});
  });

  app.post("/upload", function(req, res) {
    if (!req.files)
      return res.status(400).send("No files were sent.");

    if (!uploadFiles(req.files.image, res, __dirname)) {
      // TODO: change later ~
      res.write("<h1>Uploaded </h1>"); 
      res.write("<a href='/'>Back</a>");
      res.end();
    }
    else
      res.json({error: "no files attached"});
  });

  // ReactVR Routing
  app.use("/vr", function(req, res) {
    res.render("production", {});
  });


  app.get("/dummy", function(req, res) {
    res.json(dummy.buildings.IPPD);
  });


  // Wildcard for everything else
  app.use("/*", function(req, res) {
    res.redirect("/vr");
  });

  return app;
};