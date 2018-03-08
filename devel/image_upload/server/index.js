var express = require('express');
var app = express();
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

//app.get(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/upload', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

/*
  var files = [], fields = [];
  form.on('field', function(field, value) {
    fields.push([field, value]);
  });
  form.on('file', function(field, file) {
    console.log(file.name);
    files.push([field, file]);
  });
  form.on('end', function() {
    console.log('done');
    res.redirect('/');
  });
*/

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var oldpath = files.image.path;
    var newpath = __dirname + '/public/upload/' + files.image.name;
    //var fileObj = {};
    //fileObj.name = files.image.name;
    //fileObj.path = '/public/upload/';
    
    fs.rename(oldpath, newpath, function(err) {
      if(err)
        throw err;
      else
      {
        console.log('New image uploaded as:\n' + newpath);
        res.write('<h1>Uploaded</h1>'); 
        res.write("<a href='/'>Back</a>"); 
      }
      res.end();
    });
  });
}); 

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
})

app.listen(3000, function() {
   console.log('Listening on port 3000!');
});

