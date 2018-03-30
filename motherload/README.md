# IPPD 2017-18, Serverful - Team 19

## Dependencies
- [Node and npm 6.x](https://nodejs.org/en/)

## Installation
- Clone/Download
- Browse to 'motherload'
- run `npm run first install` - this may take several minutes
- run `npm start`. It'll open on [localhost port 5001 /vr](http://localhost:5001/vr)

<!-- ## Installation
- Clone/Download
- Browse to `react-demo`, then run `npm install` and `npm start`. Then browse to [localhost port 8081 /vr](http://localhost:8081/vr). **Note:** it'll take a while to compile/bundle the first time you load it. -->

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

# Operationalizing TODOs

### Main Task
- Graph search algorithm for map view and assignment of navigation elements to each 'room'
- Async f(x) to link mapping views to cloud image locations (Alex)
- General Server (Marcial)
- [Bleh one](#bleh)

### Detailed breakdowns


#### 'REST API'
  - GETs: On initial room load and one navigation button clicks
    - Search by building mongo ID, and default to floor 1, initial room
  - PUT/POST/DELETE: on what you think. save of new tooltips is a PUT thou

#### DB Architecture
  - Buildings:
    + (Marcial note to self) Use verification code from SWE project
    + array of references to rooms
    + *ALL REQUIRED*
    + '#' of Floors?
    + State => abbv. dropdown, but also map in the backend (on save/new) the FULL state names
      * Long_State: backend only property, for search convenience
    + City
    + 'Name'
      * Address? => no for now

  - Rooms:
    + INITIAL ROOM!! - Add this property
    array/obj of pictures path locations to static resource cloud (- cloudfoundry, S3 bucket)
    + 'tooltips'
      * notes
      + navigation
        - hard-coding 1/4 circle degrees
          + normal ones (0, 90, 180, 270)
          + diagonals (45, 135, 225, 315)
        - <a name='bleh'>*TODO*</a>: figure out what's the '0' degree by default...
          + => Center of the right sphere on the normal file, whatever that means
        - how to make these editable if we're moving them around??
        allow for 'navigation' toggle ~ or just make them into 'tooltips - toggle' compatible/friendly

- React <=> DB
  + Save button toggles PUTs only!
  + Implement all the GETs
    * If you wanna navigate to array specific room, how do I pass in optionals commands?
      - => '?' query, and then process it in the local react ~
      ```
        window.location.href (lolz), split by '?' and all that jazz
        or
        this.props.location.pathname <= if routing defined ~
      ```
      - from there we can define go-to commands ~

- Frontend
  + Search View
    * // Only needed if the building search bar is too hard/ugly/inconvinient in ReactVR

    ```
    ====================
          NAVBAR
    --------------------
        | Search bar ng-model='search'
        | --------------
        |
    MAP | [ng-repeat of buildings | filter:search | limitTo: 20?-50?]
        |
        |
    --------------------
    ====================
    ```

    * Use Google Charts for the map, and then on click event, query the local base of the array by state ~
      Dependencies ++

  + Mapping view
    * MockUp base, but instead of circles it should be squares ~
    * Retrieve the paths of the pano files (wherever they are), and link them to the index of the original submitted files.
      This should be done without the user having to wait for all the files to be converted (ie async), and should not refresh the page or what not (i.e. not using the http 'res', but rather a socket or a service)
        - *Assigned to Alex for now*
        - No idea about the frontend part (listener/observer) yet
    * No drag and drop, selection will be done by numbers (nth number picture at x square etc)
    * *IMPORTANT* Graph algo that creates navigation buttons relations between the files/room objs
      - Continuous pictures should be made into each others navigation buttons. blank ones will be buffers zone
    * How to edit buildings' room configuration?
      - Save the 'structure' used to generate the the navigation buttons angles, repopulate the picture side menu (lots of downloads/data use)?, and allow for the same process as initial floor creation f(x)nality.



# Old Readme stuff
## Panoramic Conversion (Alex)
### Instalation
+ Install *Hugin* by either installing [Hugin-win64.msi](stiching/Hugin-win64.msi) on windows, or [download it](http://hugin.sourceforge.net/download/) if you're not on Window x64
+ If on Windows: Add the files inside `stiching` to your path

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
