// This file details CRUD functionality of the user database object

// Dependencies
var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;
var User = require('./users.model.js') ;

module.exports = {

  create: function(req, res, next) {
    var newUser = new User({
      dl: req.body.dl,
      dob: req.body.dob,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      
      isAdmin: req.body.isAdmin,
    });
    // console.log("WHAT", newUser);

    if (req.body.username && req.body.password) {
      newUser.save(function(err, realNewUser) {

        if (err) {
          if (err.toJSON().code == 11000) {
            console.log("oink same shit..", err);
            res.json({ 
              err,
              message: 'Username or email already exist!' ,
            }); 
          }
          else {
            console.log(err);
            res.json({ 
              message: err
            });
          } 
        } else {
          console.log(realNewUser);
          next();
        }
      });
    } else {
      res.json({ error: 'Ensure username, email or password was provided' });
    }
  },

  read: function(req, res) {
    res.json(req.user) ;
  },

  update: function(req, res) {
    var oldUser = req.user;
    // console.log(req.body);

    // Replace old user's properties with the newly sent ones
    var userToBeUpdated = Object.assign(oldUser, req.body, function(former, replacement){
      if (!replacement) return former;
      else return replacement;
    });
    
    // {new: true} => Returns the real/actual updated version
    //             => 'updatedUser'
    User.findByIdAndUpdate(oldUser._id, userToBeUpdated, {new: true}, 
      function(err, updatedUser) {
        if (err) res.status(404).send(err);
        else res.json(updatedUser);
    });
  },

  delete: function(req, res) {
    User.findByIdAndRemove(req.user._id, function(err) {
      if (err) res.status(404).send(err);
      else res.json(req.user);
    });
  },

  returnUsers: function(req, res) {
    res.json(req.users);
  },

  // Get all user data
  getAll: function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else {
        if (typeof next === "function") {
          req.users = users;
          next();
        }
        else {
          console.log("something's off! check users.getAll");
        }
      }
    });
  },

  // Get all user names
  // TODO: maybe leave to frontend
  getAllUsernames: function(req, res, data) {
    var users = req.users;
    var user_names = [];
    users.forEach(function(item, index) {
      user_names.push(item.username);
    })
    res.json(user_names) ;
  },
  
  userByID: function(req, res, next, id) {
    if (!id && req.body.token)
      id = req.body.token.id;

    console.log(id, req.body, req.body.token);

    if (id) {
    User.findById(id).exec(function(err, user) {
      if (err) {
        console.log(err) ;
        res.status(400).send(err) ;
      }
      else {
        req.user = user;
        next() ;
      }
    });
    }
  }
};