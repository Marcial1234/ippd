var fs = require('fs');
var exec = require('child_process').exec;
var cloudinary = require('cloudinary');
var dirname, size;

const FILE_EXTENTION = ".jpg";
const PANO_EXTENTION = "_pano.jpg";
const PANO_DIRECTORY = "panos\\";
const WIN_SCRIPT_NAME = "win-gear360pano.cmd";
const STICHING_SCRIPT_PATH = "..\\client\\gear360pano\\";

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: 'serverful',
});

preProcessFiles = (req, res) => {

  console.log(req.body);
  console.log(req.files);
  console.log(req.timeout);

  if (!req.files)
    res.json({err: "no files"});
  else {
    uploadFiles(Object.values(req.files), res)
  }
}

validate = (panoPaths, invalidPanos) => {
  for (let i = panoPaths.length - 1; i < -1 ; i--) {
    if (!fs.existsSync(panoPaths[i])) {
      console.log(panoPaths[i], "DOESNT'TTT")
      invalidPanos.push(i)
      panoPaths = panoPaths.slice(i, 1)
    }
  }
}

uploadFiles = async (images, res, perent_dir) => {

  let panoPaths, failedStitching, cloudPaths, invalidPanos = []
  size = images.length;

  // we're on the "server folder, and want the base project path"
  // GLOBAL FOR THIS FILE
  dirname = __dirname + "/../";

  // copy/move images to server ~ get pano paths
  panoPaths = images.map(uploadToServer)
  Promise.all(panoPaths).then((responseeee) =>
    res.json({panos: responseeee})
  )
  // console.log(panoPaths)

  // stich images
  // console.log("startDinggggg")
  // await stich()
  // console.log("done with stitching")
  // await validate(panoPaths, invalidPanos)
  // console.log(invalidPanos, panoPaths)
  // Validation: check if all the pano paths are here ~ if not, say which index of them had error
  // [invalidPanos, panoPaths] = await validate(panoPaths)

  // push to cloud
  // cloudPaths = panoPaths.map(pushToCloud)
  // await Promise.all(cloudPaths).then(error => console.error(error))
  // res.json({paths: cloudPaths, bad: invalidPanos})
}

// .mv comes from ?? fileUpload?
uploadToServer = async (image) => {
  let basePath = dirname + PANO_DIRECTORY + image.name
  let panoPath = basePath + PANO_EXTENTION
  let path = basePath + FILE_EXTENTION

  await image.mv(path, (err) => {if (err) console.log(err)})
  console.log("Uploaded ", image.name, "as", path)
  return panoPath
} 

// TBA LINUX SCRIPT
// YOU CAN USE '-P' for PARALLEL PROCESSING IN LINUX! SHOULD BE FASTERR
// let upload_dir = dirname + '/public/upload/';
// let cmd = dirname + '/public/gear360pano/gear360pano.sh -n ' + 
//          '-r -o ' + upload_dir + image.name;
// from original: 
/*
  exec(dirname + '/public/gear360pano/gear360pano.sh -n ' + 
       '-r -o ' + dirname + '/public/upload ' + image.path,
*/
windowsStitchcommand = () => {
  let upload_dir = dirname + PANO_DIRECTORY;
  let script_path = dirname + STICHING_SCRIPT_PATH;
  let abs_script_path = script_path + WIN_SCRIPT_NAME;
  let cmd = [
    // abs_script_path, path, "/o", upload_dir,
    abs_script_path, upload_dir + "*.JPG", "/o", upload_dir,
  ].join(" ");

  return cmd
}

// Process image with gear360pano and, on exit, send to cloudinary
stich = () => {
  return new Promise((resolve, reject) => {
    cmd = windowsStitchcommand()

    // converting the files on the background
    let stitch = exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      console.log("GOING OUT");

      if (error !== null) {
        console.log(stderr);
        console.log('exec error: ${error}');
      }

      resolve(error)
    })
  })
}

// Send image to cloudinary
pushToCloud = (imagePanoPath) => {
  return new Promise((resolve, reject) => {
    console.log(imagePanoPath)

    cloudinary.v2.uploader.upload(imagePanoPath, {
      overwrite: true,
      // public_id: (Date.now() ** 1.5),
      resource_type: "image",
    }, (error, result) => {
      console.log(error);
      console.log(result);
      resolve(result)
    });
  })  
}

// do this the ES6 way later...
module.exports = preProcessFiles;