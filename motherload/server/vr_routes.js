var express = require("express");
var router = express.Router();

// Created Models
var dummy = require("./dummy").buildings;
var floors = require("./db/floors.crud.js") ;
var buildings = require("./db/buildings.crud.js") ;

// Dummy:
// router.route("/path")
//       .get(pano.read)
//       .put(pano.update)
//       .post(pano.create)
//       ;

// Bldgs routes
router.route("/getAllBuildings")
      .get(buildings.getAll);

// ~ General 'search'
// what can u edit from buildings? floors? address? idk...
router.route("/building/:bldg")
      .get(buildings.read)
      .delete(buildings.delete)
      ;

// Floor routes
router.route("/getAllFloors")
      .get(floors.getAll);

router.route("/floor/:floor")
      .get(floors.read)
      .delete(floors.read)
      ;

// Floor++, need to pass relative index within photos (pindex) and/or notes/navs (nindex)
router.route("/gNotes/:floor/:pindex/:note")
      .get(floors.changeGNotes, floors.update)
      ;

      // note values passed as JSON payload ~
router.route("/notes/:floor/:pindex/:nindex")
      .get(floors.changeNotes, floors.update)
      .delete(floors.deleteNotes, floors.update)
      ;

router.route("/navs/:floor/:pindex/:nindex/:newRotation")
      .get(floors.changeNavs, floors.update)
      ;

// uri/url change but maintaining notes
router.route("/updatePanoramic/:floor/:pindex/:newURL")
      .get(floors.changeURLs)
      ;


var preProcess = (req, res, next, param) => {
  // making these global
  pindex = req.params.pindex;
  nindex = req.params.nindex;
  newURL = req.params.newURL;
  newRot = parseInt(req.params.newRotation);
  newGNote = req.params.note;
  next();
};

// static params
router.param("note", preProcess);
router.param("pindex", preProcess);
router.param("nindex", preProcess);
router.param("newURL", preProcess);
router.param("newRotation", preProcess);

// db querible params
router.param("floor", floors.floorById);
router.param("bldg", buildings.buildingById);

module.exports = router;