var exec = require('child_process').exec;
var cloudinary = require('cloudinary');

const FILE_EXTENTION = ".jpg";
const PANO_EXTENTION = "_pano.jpg";
var   dirname;
// TODO: add other/more reused strings here
// output paths and such

// issues here with too many responses
function uploadFiles(image, res, perent_dir) {

  if (!image) // no pictures ~ will be handled on the frontend later
    return true;
  else if (!Array.isArray(image))
    var formData = [image];
  else
    var formData = image;

  dirname = perent_dir;
  console.log("Files incoming:", formData.length);

  for (var i = 0; i < formData.length; i++) {
    let image = formData[i];

    // issues with multiple of them... hmm
    var parsedImaged = uploadToServer(image, res);

    // this is handled beautifully asynchrounously :D
    // jk ~ will do a different method later ~
    processAndUploadImage(parsedImaged);
  }
}

// Upload to /public/upload with express-fileupload middleware
function uploadToServer(image, res) {
  let id = Date.now();  // Time in milliseconds
  let path = dirname + "/public/upload/" + id + FILE_EXTENTION;
  let panoPath = dirname + "/public/upload/" + id + PANO_EXTENTION;

  console.log("Uploading ", image.name, "as", path);

  image.mv(path, function(err) {
    if (err) {
      res.status(500).json({error: err});
      throw err;
    }
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

  // console.log(image);
  // === Linux / Windows Scripts ===

  // LINUX SCRIPT
  // var upload_dir = dirname + '/public/upload/';
  // var cmd = dirname + '/public/gear360pano/gear360pano.sh -n ' + 
  //          '-r -o ' + upload_dir + image.name;
  // from original: 
  /*
    exec(dirname + '/public/gear360pano/gear360pano.sh -n ' + 
         '-r -o ' + dirname + '/public/upload ' + image.path,
  */

  // WINDOWS SCRIPT
  var upload_dir = dirname + '\\public\\upload\\';
  var script_path = dirname + '\\public\\gear360pano\\';
  var cmd = [
    script_path + '\\win-gear360pano.cmd', image.path, "&&", "move", 
    script_path + image.id + PANO_EXTENTION,
    // overriding non-stiched
    upload_dir  + image.id + FILE_EXTENTION
  ].join(" ");

  // console.log(cmd);
  console.log("still here...");
  // this is converting the files on the background :D

  var stitch = exec(cmd, (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);

    if (error !== null) {
      console.log(`exec error: ${error}`);
      return false;
    }
  });

  stitch.on('close', () => {
    console.log("Stitching complete for", image.path, ". \nPushing to cloud.");
    // We get the url from this and attach + id => send it to db
    // ignoring for now... 
    // pushToCloud(image);
    console.log("Done");
  });
  stitch.on('error', () => {
    console.log("Error processing image", image.path);
  });
}

// Send image to cloudinary
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

// do this the ES6 way later...
module.exports = uploadFiles;