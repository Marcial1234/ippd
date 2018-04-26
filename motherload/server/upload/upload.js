let fs = require('fs')
let exec = require('child_process').exec
let cloudinary = require('cloudinary')
let dirname, floorm, weAreStitching = false

const FILE_EXTENTION = ".jpg"
const PANO_EXTENTION = "_pano.jpg"
const WIN_SCRIPT_NAME = "win-gear360pano.cmd"

// these are relative to base folder "..\\server"
const STICHING_SCRIPT_PATH = "\\client\\gear360pano\\"
let PANO_DIRECTORY = "client\\static_assets\\"

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: 'serverful',
})

preProcessFiles = (req, res) => {

  console.log(req.body)
  console.log(req.files)
  console.log(req.timeout)

  if (!req.files)
    res.json({err: "no files"})
  // else if (!req.body.floor)
  //   res.json({err: "'floor' hash intended as directory not passed"})
  else {
    // floor = req.body.floor
    // PANO_DIRECTORY += [floor, "\\"].join("")
    let files = Object.values(req.files)
    weAreStitching = req.body.stitch
    console.log("are we?", weAreStitching)

    // let names = [], 
    // for (let f in files) {
    //   name.push(f.name)
    // }

    if (!fs.existsSync(PANO_DIRECTORY)) {
      fs.mkdirSync(PANO_DIRECTORY)
    }
    
    uploadFiles(files, res)
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
  // if (weAreStitching) {
  //   nameWithouthExtension = imgPath.split(".")[0]
  //   return [nameWithouthExtension + PANO_EXTENTION].join("/")
  //   // return [floor, nameWithouthExtension + PANO_EXTENTION].join("/")
  // }
  // else 
  return imgPath
}

uploadToServer = async (image) => {
  let path = PANO_DIRECTORY + image.name
  await image.mv(path, (err) => {if (err) console.log(err)})
  // .mv comes from express-fileUpload?
  console.log("Uploaded ", image.name, "as", path)
  return getPanoPath(image.name)
} 

// LINUX SCRIPT
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
  let upload_dir = dirname + PANO_DIRECTORY
  console.log(upload_dir)

  let script_path = dirname + STICHING_SCRIPT_PATH
  let abs_script_path = script_path + WIN_SCRIPT_NAME
  
  let cmd = [
    abs_script_path, 
    upload_dir + "*.JPG", 
    "/o", 
    upload_dir,
  ].join(" ")

  return cmd
}

// Process image with gear360pano script
stich = async () => {
  return new Promise((resolve, reject) => {
    cmd = windowsStitchcommand()

    // converting the files on the background
    let stitch = exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      console.log("GOING OUT");

      if (error !== null) {
        console.log(stderr)
        // console.log('exec error:', error)
      }

      resolve(error)
    })
  })
}

uploadFiles = async (images, res, extraParams) => {

  let size = images.length
  let panoPaths, failedStitching, cloudPaths, invalidPanos = []

  // we're on the server folder, and want the base project path
  // GLOBAL FOR THIS FILE
  dirname = __dirname + "/../../"

  // copy/move images to server ~ get pano paths
  panoPaths = images.map(uploadToServer)
  console.log(panoPaths)
  Promise.all(panoPaths).then((paths) => {
    console.log("startDinggggg", weAreStitching)

    // hmm
    // if (weAreStitching == true) {
    //   console.log("??", weAreStitching)
    //   stich().then(
    //     res.json({panoPaths: paths})
    //   )
    // }
      console.log("!!", weAreStitching)
      res.json({panoPaths: paths})
    // else {
    // }
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
    }, 
    (error, result) => {
      console.log(error)
      console.log(result)
      resolve(result)
    })
  })  
}

module.exports = preProcessFiles