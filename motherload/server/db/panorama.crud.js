var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var Panorama = require('./panorama.model.js') ;
var exec = require('child_process').exec;

//----------------------------------------------------------------------
// CRUD functionality for the 360 images. Everything is based on DB ID
//----------------------------------------------------------------------
module.exports = {
  create: function(req, res) {
    var newPanorama = new Panorama(req.body);
    console.log(newPanorama);
    // pass it thru the conversion command...
    // exec("gear360pano .\360_0025[1].JPG    ")
    // hmmmm how to do this...

    newPanorama.save(function(err, realNewPanorama) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      } else res.json(realNewPanorama) ;
    });
  },

  read: function(req, res) {
    res.json(req.pano) ;
  },

  update: function(req, res) {
    var oldLoan = req.pano;
    // console.log(req.body);

    // Replace old picture's properties with the newly sent ones
    var pictureToBeUpdated = Object.assign(oldLoan, req.body, function(former, replacement){
      if (!replacement) return former;
      else return replacement;
    });
    
    // {new: true} => Returns the real/actual updated version
    //             => 'updatedPanorama'
    Panorama.findByIdAndUpdate(oldPanorama._id, pictureToBeUpdated, {new: true}, 
      function(err, updatedPanorama) {
        if (err) res.status(404).send(err);
        else res.json(updatedPanorama);
    });
  },
  
  delete: function(req, res) {
    Panorama.findByIdAndRemove(req.Panorama._id, function(err) {
      if (err) res.status(404).send(err);
      else res.json(req.pano);
    });
  },

  getAll: function(req, res) {
    Panorama.find({}, function(err, panoramas) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(panoramas) ;
    });
  },
  
  // Middleware
  panoramaByID: function(req, res, next, id) {

    if (id < 2) {
      req.pano = id;
      next();
    }
    else {
      req.err = "dale";
      next();
    }
    
    // Panorama.findById(id).exec(function(err, pano) {
    //   if (err) {
    //     console.log(err);
    //     req.pano = {err: "dale"};
    //     // res.status(400).send(err) ;
    //     next();
    //   }
    //   else {
    //     req.pano = pano;
    //     next();
    //   }
    // });
  }

};