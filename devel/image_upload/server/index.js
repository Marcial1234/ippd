var express = require('express');
var app = express();
var router = express.Router();

var exec = require('child_process').exec;
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

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
  form.encoding = 'utf-8';
  form.keepExtensions = false;
  form.maxFieldsSize =  1073741824;  // 1GB max
  form.maxFieldsSize =  1;  // 1GB max
  form.maxFields = 100;  //100 images max

  //Progress
  form.on('progress', function(bytesReceived, bytesExpected) {
    var progress = Math.round(bytesReceived/bytesExpected*100);
    console.log('Progress: ' + progress + '%');
    res.write('<p>Progress: ' + progress + '%<p>'); 
  });

  form.on('error', function(err) {
    console.log("ERROR");
  });

  //Upload file
  form.parse(req, function(err, fields, files) {
    var oldpath = files.image.path;
    var newpath = __dirname + '/public/gear360pano/to_pano.' + files.image.name;

    //Create DB entry
    var fileObj = {
      path: newpath,
      name : files.image.name
    };
    
    fs.rename(oldpath, newpath, function(err) {
      if(err)
        throw err;
      else
      {
        var stitch = exec(__dirname + '/public/gear360pano/gear360pano.sh -n ' + 
                          '-o ' + __dirname + '/public/upload ' + 
                          __dirname + '/public/gear360pano/to_pano*',
          (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if(error !== null)
              console.log(`exec error: ${error}`);
          }
        );

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

