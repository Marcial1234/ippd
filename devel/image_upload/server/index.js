var cloudinary = require('cloudinary');
var exec = require('child_process').exec;
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');

var app = express();
app.use(fileUpload());

cloudinary.config({
  cloud_name: 'serverful',
  api_key: '627713686888251',
  api_secret: '_GgV9Ru9rsEHFApnwTv_LedR-wg'
});
var upload_stream

function uploadToServer(image, res) {
  let date = Date.now();
  console.log("Uploading " + image.name + " as: to_pano_" + date + ".png");

  image.mv(__dirname + "/public/upload/to_pano_" + date + ".png", function(err) {
    if(err)
      return res.status(500).send(err);
    res.write("Image(s) uploaded");
  });
} 

function processImages() {
}

/**
 * Root page
 */
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

/**
 * Post to upload page
 */
app.post('/upload', function(req, res) {
  if(!req.files)
    return res.status(400).send("No files were sent.");

  let formData = req.files.image;
  if(Array.isArray(formData)) {
    console.log("Files incoming: " + req.files.image.length);
    for(var i = 0; i < req.files.image.length; ++i) {
      let image = formData[i];
      uploadToServer(image, res);
    }
  }
  else if(formData) {
    console.log("Files incoming: 1");
    uploadToServer(formData, res);
  } 

  
/*
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
*/
}); 

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
})

app.listen(3000, function() {
   console.log('Listening on port 3000!');
});

