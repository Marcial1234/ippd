# IPPD 2017-18, Serverful - Team 19

## Dependencies
- [Node and npm 6.x](https://nodejs.org/en/)

## Installation
- Clone/Download
- Browse to 'motherload'
- run `npm install` - this may take several minutes
- run `npm run first-install` - this may take several minutes
- run `npm start`. It'll open on [localhost port 5001](http://localhost:5001). You can browse to generic VR on [localhost:5001/vr](http://localhost:5001/vr).
  + **NOT RESPONSIBLE FOR ERRORS IF THIS PORT DOESN'T WORK**
  + Check cross-origin issues...

# Operationalizing TODOs

### Main Task
- Async f(x) to link mapping views to cloud image locations
- Finish React CRUD (Deletes, correct indexing for no overrides)
- Polish up frontend with extra features (floor editing, note search, preview pano)
- Clean and Document
- Create dummy VR floor with basic '404'-like message

### Detailed breakdowns

#### 'REST API'
  - Done for the most part, some issues with notes atm. will prob make more endpoints..

#### DB Architecture
  - Buildings:
    + Address? => no for now

  - Rooms:
  Obj of pictures path locations to static resource cloud, i.e cloudfoundry, S3 bucket
    + 'tooltips'
      + navigation
        - hard-coding 1/4 circle degrees
          + normal ones (0, 90, 180, 270)
          + diagonals (45, 135, 225, 315)
        - <a name='bleh'>*TODO*</a>: figure out what's the '0' degree by default...
          + => Center of the right sphere on the normal file, which means the 'left' of the camara looking forwads (do we know what forwads is)?

- React <=> DB
  + Verify query params (?key=value) work 100% 
    * bldg
    * floor
    * room

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


# Old Readme
## Panoramic Conversion
### Instalation
+ Install *Hugin* by either installing [Hugin-win64.msi](stiching/Hugin-win64.msi) on windows, or [download it](http://hugin.sourceforge.net/download/) if you're not on Window x64
+ If on Windows: Add the files inside `stiching` to your path (look for `gear360pano` files if folder not found).

### Use
- Once the above it's done, run `win-gear360pano [either a wildcard or path to unstriched files]`
    - Works on windows x64
    - If not, manually run `win-gear360pano.cmd [path to unstiched files]` on the bash script's directory.
'Stitched' panoramic files will be dumped as `[original file name]-pano.[original extension]`
