var fs = require('fs');
var exec = require('child_process').exec;
var cloudinary = require('cloudinary');
var dirname;

const FILE_EXTENTION = ".jpg";
const PANO_EXTENTION = "_pano.jpg";
const PANO_DIRECTORY = "panos\\";
const WIN_SCRIPT_NAME = "win-gear360pano.cmd";
const STICHING_SCRIPT_PATH = "..\\client\\gear360pano\\";
// TODO: add other/more reused strings here
// output paths and such

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: 'serverful',
});

// issues here with too many responses
function uploadFiles(images, res, perent_dir) {
  if (!images)
    return true;

  // we're on the "server folder, and want the base project path"
  dirname = perent_dir + "/";
  let i = 1, size = Object.keys(images).length;
  console.log("Files incoming:", size);
  uploadToServer(images[0])

  // this is handled beautifully synchrounously :D
  while (processAndUploadImage(uploadToServer(images[i]))) {
    i += 1
    console.log(i, "waiting...")
  }

  // We get the url from this and attach + id => send it to db
  // ignoring for now... 
  // pushToCloud(image);
}

// Upload to /public/upload with express-fileupload middleware
function uploadToServer(image, res) {
  if (!image)
    return false

  let id = Date.now();  // Time in milliseconds
  let path = dirname + PANO_DIRECTORY + id + FILE_EXTENTION;
  let panoPath = dirname + PANO_DIRECTORY + id + PANO_EXTENTION;

  console.log("Uploading ", image.name, "as", path);
  // create paths here if they aren't there ...

  image.mv(path, function(err) {
    // fix all this ~
    // if (err) {
    //   res.status(500).json({error: err});
    //   throw err;
    // }
  });

  return {
    id: id,
    path: path,
    name: image.name,
    panoPath: panoPath,
  };
} 

// Process image with gear360pano and, on exit, send to cloudinary
function processAndUploadImage(image) {

  if (!image)
    return false

  // === Linux / Windows Scripts ===

  // LINUX SCRIPT
  // let upload_dir = dirname + '/public/upload/';
  // let cmd = dirname + '/public/gear360pano/gear360pano.sh -n ' + 
  //          '-r -o ' + upload_dir + image.name;
  // from original: 
  /*
    exec(dirname + '/public/gear360pano/gear360pano.sh -n ' + 
         '-r -o ' + dirname + '/public/upload ' + image.path,
  */

  // WINDOWS SCRIPT
  let upload_dir = dirname + PANO_DIRECTORY;
  let script_path = dirname + STICHING_SCRIPT_PATH;
  let abs_script_path = script_path + WIN_SCRIPT_NAME;
  let cmd = [
    abs_script_path, image.path, "/o", upload_dir,
  ].join(" ");

  // this is converting the files on the background :D

  // let notRan = true;

  // while (notRan) {
  //   // ugly but idk what to do ~
  //   fs.open(abs_script_path, 'r+', function(err, fd) {
  //     if (err && err.code === 'EBUSY') {
  //       fs.close(fd, function() {
  //         // run now
  //       }
  //     }
  //   }
  // }

  // figure out a way to get the 'done'
  let stitch = exec(cmd, (error, stdout, stderr) => {
    console.log(stdout);
      
    if (error !== null) {
      console.log(stderr);
      console.log(`exec error: ${error}`);
    }
  });

  stitch.on('close', () => {
    // push an a ARRAY WITH ALL OF THEM
    console.log("Stitching complete for", image.path, "\nPushing to cloud.");
  });
  stitch.on('error', () => {
    console.log("Error processing image", image.path);
  });
}

// Send image to cloudinary
function pushToCloud(image) {
  cloudinary.v2.uploader.upload(image.panoPath, 
    {
      overwrite: true,
      public_id: image.id,
      resource_type: "image",
    },
    function(error, result) {
      console.log(result);
    });
}

// do this the ES6 way later...
module.exports = uploadFiles;