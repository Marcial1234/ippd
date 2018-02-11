# IPPD 2017-18, Serverful - Team 19

## Dependencies
- [Node and npm 6.x](https://nodejs.org/en/)

## Installation
- Clone/Download
- Browse to `react-demo`, then run `npm install` and `npm start`. Then browse to [localhost port 8081 /vr](http://localhost:8081/vr). **Note:** it'll take a while to compile/bundle the first time you load it.

## Contribution Guidelines
> WRITE YOUR PROCESS HERE, ALEX

The `master` branch should be kept CLEAN, and with a working code. Make branches and merge with `master` as you FULLY develop/implement new features. 
`branch_names_with_underscores_preferred`

**IMPORTANT**: Make issues (or spam code creator/writer) if there's spaghetti code, and we're not on 'hell weeks'.

<!-- commenting this for now -->
<!-- 
- MEAN (*run the following commands inside* `real-mean`)
    + First Installation
        + Run `npm run first-install`
        + On Windows, MAKE SURE to have admin access on cmd/powershell when running this
    + Any other time
        + Run `gulp` for automatic server and front end restart every time after that
    - Deployments to [our heroku](http://serverful.herokuapp.com/) will happen on every push to master from `real-mean`
        + **NOTE:** there's an independent Git repo in `real-mean` to manage this.
 -->

## Panoramic Conversion (Alex)
### Instalation
+ Install *Hugin* by either installing [Hugin-win64.msi](real-mean/Hugin-win64.msi) on windows, or [download it](http://hugin.sourceforge.net/download/) if you're not on Window x64
+ Add the files inside `real-mean\stiching` to your path

### Use
- Once the above it's done, run `gear360pano [either a wildcard or path to unstriched files]`
    - Works on windows x64
    - If not, manually run `gear360pano.cmd [path to unstiched files]` on the bash script's directory.
'Stitched' panoramic files will be dumped as `[original file name]-pano.[original extension]`

### TODOs (Alex)
- Install the dependencies on a server in the 'cloud'/PaaS platform (AWS, Azure, OVH, etc)
- Create a server endpoint on which you can serve an image object (most likely a base64 encoded image => less storage), and return back an object (JSON/Base64 text) of the panoramic equivalent picture.
    + Attempt to handle bad conversions gracefully, so that the server doesn't crash on bad input
    + **Interesting part**, handling the storage currently necessary (since the bash script uses file references) to conversion input/output (fish-eye pictures => panoramic). The converter server should IDEALLY not store any of this... if anything it could temporary in a S3 bucket or something.
    + Another possible tool for this, yet untested is [this](https://github.com/ppwwyyxx/OpenPano). It's in C++, has another stack of dependencies.
- Document issues experienced and tutorials used in order to replicate process

## General TODOs (in the ~ works ~)
- Create a UI that allows for picture uploading (80% DONE)
    + Upload images remotely (80% but buggy)
        + So far only storing a base64 representation of them
    + Convert to panomaric on the backend with [this bash utility](https://github.com/ultramango/gear360pano#requirements) (80%)
        + Works manually
        + Need to have remote file storage and creation before fully getting this to work (S3??)
- Turn React VR source (tourOfTheChester.json) into a normal JS object in order to dynamically alter it
    + Allow for tooltips (aka annotations) CRUD
        + Create: On n amount of clicks, calculate the offsets/rotationY needed to create the tooltips
    + TBA: Store into into a nice DB format somewhat compatible with Verizon's old/Oracle style
+ Add the "map" view that shows to location of where the picture was taken inside of central office.
