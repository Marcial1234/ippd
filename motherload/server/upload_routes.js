var express = require('express');
var router = express.Router();

// Created Models
var uploadFiles = require("./upload/upload");

router.route('/')
      .get((req, res) => res.render("upload") )
      .post(uploadFiles)
      // test this?
      .all((req, res) => res.redirect("/404"))
      ;

router.route("/*")
      .all((req, res) => res.redirect("/404"));

module.exports = router;