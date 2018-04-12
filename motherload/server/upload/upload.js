var fs = require('fs');
var exec = require('child_process').exec;
var cloudinary = require('cloudinary');
var dirname, floor;

const FILE_EXTENTION = ".jpg";
const PANO_EXTENTION = "_pano.jpg";
const WIN_SCRIPT_NAME = "win-gear360pano.cmd";

// these are relative to base folder "..\\server"
const STICHING_SCRIPT_PATH = "\\client\\gear360pano\\";
let PANO_DIRECTORY = "client\\static_assets\\"

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
    if (req.body.floor) {
      floor = req.body.floor
      PANO_DIRECTORY += [floor, "\\"].join("")

      if (!fs.existsSync(PANO_DIRECTORY)) {
        fs.mkdirSync(PANO_DIRECTORY);
      }
    }

    uploadFiles(Object.values(req.files), res)
  }
}

// do this on frontned...
validate = (panoPaths, invalidPanos) => {
  for (let i = panoPaths.length - 1; i < -1 ; i--) {
    if (!fs.existsSync(panoPaths[i])) {
      console.log(panoPaths[i], "DOESNT'TTT")
      invalidPanos.push(i)
      panoPaths = panoPaths.slice(i, 1)
    }
  }
}

const timeout = ms => new Promise(res => setTimeout(res, ms))

getPanoPath = (imgPath) => {
  nameWithouthExtension = imgPath.split(".")[0]
  return [floor, nameWithouthExtension + PANO_EXTENTION].join("/")
}

// .mv comes from ?? fileUpload?
uploadToServer = async (image) => {
  let basePath = PANO_DIRECTORY + image.name
  let path = basePath + FILE_EXTENTION

  let panoPath = basePath + PANO_EXTENTION
  await image.mv(path, (err) => {if (err) console.log(err)})
  console.log("Uploaded ", image.name, "as", path)
  return getPanoPath(image.name)
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
  console.log(upload_dir)

  let script_path = dirname + STICHING_SCRIPT_PATH;
  let abs_script_path = script_path + WIN_SCRIPT_NAME;
  
  let cmd = [
    abs_script_path, 
    upload_dir + "*.JPG", 
    "/o", 
    upload_dir,
  ].join(" ");

  return cmd
}

// Process image with gear360pano script
stich = async () => {
  return new Promise((resolve, reject) => {
    cmd = windowsStitchcommand()
    // console.log(cmd)
    // console.log(__dirname)

    // converting the files on the background
    let stitch = exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      console.log("GOING OUT");

      if (error !== null) {
        console.log(stderr);
        // console.log('exec error:', error);
      }

      resolve(error)
    })
  })
}

uploadFiles = async (images, res, extraParams) => {

  let size = images.length;
  let panoPaths, failedStitching, cloudPaths, invalidPanos = []

  // we're on the server folder, and want the base project path
  // GLOBAL FOR THIS FILE
  dirname = __dirname + "/../../";

  // copy/move images to server ~ get pano paths
  panoPaths = images.map(uploadToServer)
  Promise.all(panoPaths).then(async (paths) => {
    console.log("startDinggggg")
    await stich()
    res.json({panoPaths: paths})
  })

  // push to cloud
  // NOT IMPLEMENTING THIS
}

// Send image to cloudinary
// NOT WORKING
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