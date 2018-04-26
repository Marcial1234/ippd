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
  -**Set Image Rotation**
    + Add ability to use camera rotation to set each image's default rotation, and use this in addition to the already existing rotation used for focusing on a note.
  -**Consistent Note Display**
    + At some points, the note text can be cut off. Other times after editing text, the formatting can be off. This may be able to be fixed by adding custom ReactVR code.
  -**Improved Notes List**
    + Add ability to scroll through list of notes on page. Possibly moving it from React VR to React for cleaner functionality on a 2D plane.
  -**Customize Zoom**
    + Allow custom zoom bar like Google Maps. Prevent zoom from zooming in on the static elements
  -**Add Responsiveness**
    + Make all ReactVR and React elements responsive for use on any size screen, portrait or landscape.

## Still TBD
- Finish Frontend Deletes of floors in Buildings
- Create dummy VR floor with basic/funy '404'-like message
