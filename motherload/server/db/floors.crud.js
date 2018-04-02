var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// var exec = require('child_process').exec;

var Floor = require('./floors.model.js');

//---------------------------------------------
// CRUD f(x)ality for each floor within a Floor
//---------------------------------------------
module.exports = {

  // TBA
  // create: (req, res) => {
  //   var newFloor = new Floor(req.body);
  //   console.log(newFloor);

  //   newFloor.save((err, realNewFloor) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(400).send(err);
  //     } else res.json(realNewFloor);
  //   });
  // },

  // normal get
  read: (req, res) => {
    res.json(req.floor);
  },

  update: (req, res) => {
    Floor.findByIdAndUpdate(req.floor._id, req.floor, {new: true},
      function(err, updatedNote) {
        if (err) res.status(404).send(err);
        else res.json(updatedNote);
    });    
  },

  delete: (req, res) => {
    Floor.findByIdAndRemove(req.floor._id, (err) => {
      if (err) res.status(404).send(err);
      else res.json(req.floor);
    });
  },

  getAll: (req, res) => {
    Floor.find({}, (err, floor) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else res.json(floor);
    });
  },

  // Extra floor f(x)nality
  changeGNotes: (req, res, next) => {
    req.floor.photos[pindex].gNotes = newGNote;
    next();
  },

  changeNavs: (req, res, next) => {
    req.floor.photos[pindex].navs[nindex].rotationY = newRot;
    next();
  },

  changeNotes: (req, res, next) => {
    // re-assigning all values ~
    // req.body == { note obj }
    req.floor.photos[pindex].notes[nindex] = req.body;
    next();
  },

  deleteNotes: (req, res, next) => {
    req.floor.photos[pindex].notes.splice(nindex, 1);
    next();
  },

  changeURLs: (req, res, next) => {
    req.floor.photos[pindex].uri = newURL;
    next();
  },

  // Middleware
  floorById: (req, res, next, id) => {
    // console.log(id);

    Floor.findById(id).exec((err, floor) => {
      if (err) {
        console.log(err);
        req.err = err;
        // res.status(400).send(err);
        next();
      }
      else {
        req.floor = floor;
        // console.log(floor);
        next();
      }
    });
  },

};