# IPPD 2017-18, Serverful - Team 19

## Dependencies
- [Node and npm](https://nodejs.org/en/). If you already have Node installed, make sure your version supports ES6 Syntax, or at least fat array and object spread notations. Check [here](https://node.green/) for references.
+ [Hugin](http://hugin.sourceforge.net/download/) for automatic 'two spheres to panoramic' conversion.

## Installation
- Clone/Download
- Browse to 'motherload'
- run `npm run first-install` - this may take several minutes
- run `npm start`. It'll open on [localhost port 5001](http://localhost:5001)
  + Don't run `node server.js`, as internal routing is based on this port that's triggered from `gulp` and `browser-sync` on local environments.
- Check [localhost:5001/vr](http://localhost:5001/vr) for a generic VR page.

<!-- - Frontend
  + Search View
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
 -->

## API Enpoints
<!-- picture -->

## DB Architecture
### Buildings
<!-- picture -->

### Rooms
<!-- picture -->

## Future Suggetions

### Server
  - Upload of pictures to a cloud service. Had issues with Async JS.
    + Will need to change change the VR's source mechanisms from 'asset()' to pure links
  - Have optional panoramic conversion/stiching, or separate the stitching process altogether and just make a Python script for it.
  - Convert panoramic conversion command to Linux. [Docs](https://github.com/ultramango/gear360pano).

### Frontend
  - **Floor editing**
    + Save the array/matrix used to generate the the navigation buttons angles and its dimenetions (x, y), repopulate the picture side menu, and allow for the same process as initial floor creation f(x)nality.
  - **Note search**
    + Just an array index checking f(x) will do.
  - **Preview links**
    + A service-like f(x) is already there that checks if the backend has finished uploading pictures, and it returns their path. You can then create a horitontally scrolable section on the map view (FloorMap.html) of their previews (img source =...) with a preview link to the VR `/vr?preview=[path]`. `path` being from within `static_assets` folder.
  - **Map-based Search View**
    + Use Google Charts for the map (US Map f(x) built-in), and then on click event, change angular 'search'.
  - Have a designer/UI person on your team :relaxed: :grin:

### VR
<!-- more here -->

## Still TBD
- Finish Frontend Deletes of floors in Buildings
- Create dummy VR floor with basic/funy '404'-like message