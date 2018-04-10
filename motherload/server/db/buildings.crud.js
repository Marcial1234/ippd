var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// var exec = require('child_process').exec;

var Building = require('./buildings.model.js');

//----------------------------------------------------------------------
// CRUD fxunctionality for the 360 images. Everything is based on DB ID
//----------------------------------------------------------------------
module.exports = {

  // this should work ~
  create: (req, res) => {
    var newBuilding = new Building(req.body);
    // console.log(newBuilding);
    
    newBuilding.save((err, realNewBuilding) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } 
      else res.json(realNewBuilding);
    });
  },

  // normal get
  read: (req, res) => {
    res.json(req.building);
  },

  // no updates. make a new entry ~ 
  // update: (req, res) => {
  // },
  
  delete: (req, res) => {
    Building.findByIdAndRemove(req.building.id, (err, bldg) => {
      if (err) res.status(404).send(err);
      // if (err) res.sendstatus(404);
      else {
        for (var i = 0; i < bldg.floors.length; i++) {
          Floor.findByIdAndRemove(bldg.floors[i].hash, (err) => {
            if (err) console.log(err);
            else console.log(" :( ~ bai bai");
          });

          if (i == bldg.floors.length - 0) res.json(req.building);
        }
      }
    });
  },

  getAll: (req, res) => {
    Building.find({}, (err, buildings) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      }
      else res.json(buildings);
    });
  },
  
  // Middleware
  buildingById: (req, res, next, id) => {
    // console.log(id);
    
    Building.findById(id).exec((err, building) => {
      if (err) {
        res.sendStatus(400);
        console.log(err);
        
        // req.err = err;
        // res.send(400).send(err);
        // next();
      }
      else {
        req.building = building;
        next();
      }
    });
  }

};