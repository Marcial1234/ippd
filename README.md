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
+ Install *Hugin* by either installing [Hugin-win64.msi](stiching/Hugin-win64.msi) on windows, or [download it](http://hugin.sourceforge.net/download/) if you're not on Window x64
+ If on Windows: Add the files inside `stiching` to your path

### Work Done
- Install the dependencies on a server in the 'cloud'/PaaS platform (AWS, Azure, OVH, etc)
- Create a server endpoint on which you can serve an image object, which it uploads and converts to panoramic

### Use
- Once the above it's done, run `gear360pano [either a wildcard or path to unstriched files]`
    - Works on windows x64
    - If not, manually run `gear360pano.cmd [path to unstiched files]` on the bash script's directory.
'Stitched' panoramic files will be dumped as `[original file name]-pano.[original extension]`


## General TODOs
- Create a form that allows for picture uploading (DONE)
- Convert to panomaric on the backend with [this bash utility](https://github.com/ultramango/gear360pano#requirements) (DONE)
- Turn React VR source (tourOfTheChester.json) into a normal JS object in order to dynamically alter it (DONE)
    + Allow for tooltips (aka annotations) CRUD
- A Bunch of ReactVR additions thanks to Master Kevin

- Store and make VR interact with a DB (IN THE WORKS)
- Merge DB, Auto-stiching, and ReactVR (IN THE WORKS)
- Create a NICE UI based on the wireframes for picture and relative navigation (TBA)
