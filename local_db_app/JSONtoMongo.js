
// save a json file into a DB ~ modify at will 
// run within npm/app for DB link

var fs = require('fs');
var mongoose = require('mongoose');

var Room = require('./db/rooms.model.js');
var jsonEntries = require('./base_tooltips.json');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.LOCAL_MONGODB_URI, { useMongoClient: true });
// mongoose.connect(process.env.CLOUD_MONGODB_URI, { useMongoClient: true });

// Instantiate a mongoose model for each object in the JSON file, and then save it
module.exports.upload_base_tooltips = function() {
  jsonEntries.entries.forEach(function(entry){
    new Room({
      uri: entry.uri,
      y_rotation_offset: entry.rotationOffset,

      tooltips: entry.tooltips,
      adjacent_rooms: entry.adjacent_rooms,
    }).save();
  });
}