var express = require("express");
var router = express.Router();

// Created Models
var floors = require("./db/floors.crud.js") ;
var buildings = require("./db/buildings.crud.js") ;

// Dummy:
// router.route("/path")
//       .get(pano.read)
//       .put(pano.update)
//       .post(pano.create)
//       .delete(pano.byebye)
//       ;
// var dummy = require("./dummy").buildings;

// Bldgs routes
router.route("/getAllBuildings")
      .get(buildings.getAll);

// ~ General 'search'
// what can u edit from buildings? floors? address? idk...
router.route("/building/:bldg")
      .get(buildings.read)
      .post(buildings.create)
      // .put(buildings.update)
      .delete(buildings.delete)
      ;

// Floor routes
router.route("/getAllFloors")
      .get(floors.getAll);

router.route("/floor/:floor")
      .get(floors.read)
      // ...
      // .post(floors.create)
      .put(floors.update)
      .delete(floors.read)
      ;

// Floor++, need to pass relative index within photos (pindex) and/or notes/navs (nindex)
router.route("/gNotes/:floor/:pindex/:note")
      .get(floors.changeGNotes, floors.update)
      ;

      // note values passed as JSON payload ~
router.route("/notes/:floor/:pindex/:nindex")
      .post(floors.changeNotes, floors.update)
      .delete(floors.deleteNotes, floors.update)
      ;

router.route("/navs/:floor/:pindex/:nindex/:newRotation")
      .get(floors.changeNavs, floors.update)
      ;

// uri/url change but maintaining notes
router.route("/updatePanoramic/:floor/:pindex/:newURL")
      .get(floors.changeURLs)
      ;

router.route("/*")
      .all((req, res) => res.redirect("/404"));

var preProcess = (req, res, next, param) => {
  // making these global
  newURL = req.params.newURL;
  pindex = parseInt(req.params.pindex);
  nindex = parseInt(req.params.nindex);
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
