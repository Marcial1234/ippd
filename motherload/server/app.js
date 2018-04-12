var io = require('./io');
var http = require('http');
var express = require('./express');

module.exports.start = function() {
  var port = (process.env.PORT || 5000);
  var app = express.init();
  var server = http.Server(app);
  server.setTimeout(3000000)
  // io.listen(server);
  
  server.listen(port, function() {
    console.log('Node app is running on port', port);
  });

};