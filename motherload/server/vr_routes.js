var express = require('express');
var router = express.Router();

// Created Models
var pano = require('./db/panorama.crud.js') ;
var dummy = require("./dummy").buildings;

// router.route('/addImage')
//       .post(pano.create)
//       .put(pano.update)
//       .delete(pano.delete);

router.route('/:pano')
      .get(function(req, res) {

        // redirect to 404 ... for now nope
        if (req.err)
          res.redirect("/upload");
        
        var key = Object.keys(dummy)[req.pano];
        res.json(dummy[key]);
      });

// router.route('/all')
//       .get(pano.getAll)

router.param('pano', pano.panoramaByID);

module.exports = router;