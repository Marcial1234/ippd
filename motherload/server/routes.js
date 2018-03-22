var express = require('express');
var router = express.Router();
var router = express.Router();

// Created Models
var Panorama = require('./db/panorama.crud.js') ;

router.route('/addImage')
      .post(Panorama.create)
      .put(Panorama.update)
      .delete(Panorama.delete);

router.route('/all')
      .get(Panorama.getAll)

// router.param('token', auth.decodeToken);

module.exports = router;