var express = require('express');
var router = express.Router();

// Created Models
var uploadFiles = require("./upload/upload");

router.route('/')
      .get((req, res) => res.render("upload") )
      .post((req, res) => {

        // i can name the args ~
        // console.log(req.files);
        console.log(req.files.image);
        
        // if (!req.files)
        //   return res.status(400).send("No files were sent.");

        // if (!uploadFiles(req.files.image, res, __dirname)) {
        //   // TODO: send asych request to frontend, 
        //   //       while angular already changed views

        //   res.write("<h1>Uploaded </h1>"); 
        //   res.write("<a href='/'>Back</a>");
        //   res.end();
        // }
        // else
        //   res.json({error: "no files attached"});

      })
      // test this?
      .all((req, res) => res.redirect("/404"))
      ;

router.route("/*")
      .all((req, res) => res.redirect("/404"));

module.exports = router;