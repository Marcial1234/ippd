// Original Uploading File
var path = require('path');
var express = require('express');
var cloudinary = require('cloudinary');
var fileUpload = require('express-fileupload');

var uploadFiles = require('./server/upload');

// Sensitive info
cloudinary.config({
  cloud_name: 'serverful',
  api_key: '627713686888251',
  api_secret: '_GgV9Ru9rsEHFApnwTv_LedR-wg'
});

var upload_stream;
var app = express();
app.use(fileUpload());

// Starting the Server
app.listen(3000, function() {
  console.log('Listening on port 3000!');
  console.log('Time:', Date.now());
});

// Root
app.get('/', function(req, res) {
  // double check if all here is nessesary...
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send("No files were sent.");

  if (!uploadFiles(req.files.image, res, __dirname)) {
    res.write('<h1>Uploaded </h1>'); 
    res.write("<a href='/'>Back</a>");
    res.end();
  }
  else
    res.json({error: "no files attached"});
});