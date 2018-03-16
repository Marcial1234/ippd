var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var path = require('path');

/*
var upload = multer({
  dest: __dirname + '../public/uploads/',
  limits: {fileSize: 1000000000, files: 100},  // Limit upload size
});

router.post('/upload', upload, function(req, res) {

});

module.exports = router;
*/
