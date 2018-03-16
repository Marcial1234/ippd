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
  let id = Date.now();  // Time in milliseconds
  let path = __dirname + "/public/upload/" + id + ".jpg";
  let panoPath = __dirname + "/public/upload/" + id + "_pano.jpg";
  console.log("Uploading " + image.name + " as " + path);

  image.mv(path, function(err) {
    if(err)
      return res.status(500).send(err);
    res.write("Image(s) uploaded");
  });

  return {
    id: id,
    path: path,
    panoPath: panoPath,
    name : image.name
  };
} 

function processAndUploadImage(image) {
  var stitch = exec(__dirname + '/public/gear360pano/gear360pano.sh -n ' + 
                    '-r -o ' + __dirname + '/public/upload ' + image.path,
                    (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    if(error !== null)
      console.log(`exec error: ${error}`);
  });

  stitch.on('close', () => {
    console.log("Stitching complete for " + image.path + ". \nPushing to cloud.");
    pushToCloud(image);
  });
  stitch.on('error', () => {
    console.log("Error processing image " + image.path);
  });
}

function pushToCloud(image) {
  cloudinary.v2.uploader.upload(image.panoPath, 
    {
      resource_type: "image",
      public_id: image.id,
      overwrite: true
    },
    function(error, result) {
      console.log(result);
    });
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
      processAndUploadImage(image.path);
    }
  }
  else if(formData) {
    console.log("Files incoming: 1");
    let image = uploadToServer(formData, res);
    processAndUploadImage(image);
  } 

  res.write('<h1>Uploaded </h1>'); 
  res.write("<a href='/'>Back</a>"); 
}); 

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
})

app.listen(3000, function() {
   console.log('Listening on port 3000!');
});

