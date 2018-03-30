
// save a json file into a DB ~ modify at will 
// run within npm/app for DB link

var fs = require('fs');
var mongoose = require('mongoose');
var entries = require('./server/db/base_tooltips.js');

// Models
var Room = require('./server/db/rooms.model.js');
var Building = require('./server/db/buildings.model.js');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.LOCAL_MONGODB_URI, { useMongoClient: true });
mongoose.connect(process.env.CLOUD_MONGODB_URI, { useMongoClient: true });

// Instantiate a mongoose model for each object in the JSON file, and then save it
module.exports.upload_base_tooltips = function() {

  // hardcoding buildings ~
  // new Building({
  //   name :  "Library",
  //   city :  "Tucson",
  //   state:  "AZ",
  //   num_floors:  1,
  // }).save();

  // new Building({
  //   name :  "IPPD",
  //   city :  "Gainesville",
  //   state:  "FL",
  //   num_floors:  1,
  // }).save();

  // went to cloud db and got this ~
  blds_refs = ["5abdbf848ab18c28d497c25e", "5abdbf848ab18c28d497c25f"];
  var entry;

  for (var i = 0; i < entries.length; i++) {
      // odd way of indexing.. but works vs json file
      entry = entries[i];

      for (dale in entry.photos) {
          console.log(dale);
          console.log(entry.photos[dale]);
      }

      // console.log(entry, blds_refs[i]);
      // console.log(entry["firstPhotoId"], blds_refs[i]);
      
      // new Room({
      //     uri: entry.uri,
      //     y_rotation_offset: entry.rotationOffset,
      //     tooltips: entry.tooltips,
      //     adjacent_rooms: entry.adjacent_rooms,
      // }).save();
  }
}