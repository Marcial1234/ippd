var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var upload_base_tooltips = require('../JSONtoMongo.js').upload_base_tooltips;
// var rooms = require("../db/rooms.crud.js");
// var api_routes = require('./api_routes.js');

// var some_file_in_same_dir = require('./some_file_in_same_dir.js');

//======================================================================================================================
// Backed routing Hub
//======================================================================================================================
module.exports.init = function() {

  // Connect to database
  mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
  // console.log(process.env.MONGODB_URI);

  // initialize app
  var app = express();

  // enable request logging for development debugging
  // Heroku automatically sets this
  if (!process.env.NODE_ENV)
    app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  // views is directory for all template files
  app.set('views', __dirname + '/../client');
  // app.set('view engine', 'ejs');

  // serve static files
  app.use('/', express.static(__dirname + '/../client'));

  // Wildcard for everything else
  app.use('/*', function(req, res, next) {
    // make this a reset route or something ~
    // console.log(upload_base_tooltips());

    res.json({
      nope: "wrong place", 
      nothing_here: "yet", 
    });
  });

  return app;
};