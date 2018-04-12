var express = require('express');
var router = express.Router();

// Created Models
var uploadFiles = require("./upload/upload");

router.route('/')
      .get((req, res) => res.render("upload") )
      .post((req, res) => {
        console.log(req.body);
        console.log(req.files);

        if (!req.files)
          res.json({err: "no files"});
        else {
          res.end();
          uploadFiles(req.files, res, __dirname)
        }
      })
      // test this?
      .all((req, res) => res.redirect("/404"))
      ;

router.route("/*")
      .all((req, res) => res.redirect("/404"));

module.exports = router;