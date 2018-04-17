
// save React Obj into a DB ~ modify at will 
// ran from  'node populateDB'

var entries = require('./server/db/base_tooltips.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Models
var Floor = require('./server/db/floors.model.js');
var Building = require('./server/db/buildings.model.js');

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });
// mongoose.connect(process.env.LOCAL_MONGODB_URI, { useMongoClient: true });
// mongoose.connect(process.env.CLOUD_MONGODB_URI, { useMongoClient: true });

// Instantiate a mongoose model for each object in the JSON file, and then save it
module.exports.upload_base_tooltips = function() {

  // // Clean start :D
  // Building.find({}, (err, buildings) => {
  //   if (!buildings) console.log("empty ~");
  //   else {
  //     for (var j = 0; j < buildings.length; j++) {
  //       var bldg = buildings[j]._id;

  //       Building.findByIdAndRemove(bldg, (err, doc) => {
  //         if (err) res.status(404).send(err);
  //         else {
  //           for (var i = 0; i < doc.floors.length; i++) {
  //             Floor.findByIdAndRemove(doc.floors[i].hash, (err) => {
  //               if (err) console.log(err);
  //             });
  //           }
  //         }
  //       });
  //     }
  //   }
  // });
  

  // hardcoding buildings ~
  var a = new Building({
    name :  "Library",
    city :  "Tucson",
    state:  "AZ",
    // num_floors:  1,
  })

  var b = new Building({
    name :  "IPPD",
    city :  "Gainesville",
    state:  "FL",
    // num_floors:  1,
  })
  // console.log(a, b);
  a.save();
  b.save();

  // went to cloud db and got this ~
  blds_refs = [a._id, b._id];
  floor_names = ["Library", "IPPD"];
  var entry, data, size, next;

  for (var i = 0; i < entries.length; i++) {
    // bleh way of indexing.. but works better vs json file
    entry = entries[i];
    
    var newFloor = new Floor({
      name: floor_names[i],
      parent: blds_refs[i],
      firstPhotoId: parseInt(entry["firstPhotoId"]) - 1,
    });

    // full 'deep' copy of photos obj
    var photos = [];
    for (dale in entry.photos) {
      data = JSON.parse(JSON.stringify(entry.photos[dale]))
      photos.push(data);
      size = photos.length - 1;

      // correct 'linkedPhotoId' type reassignment
      for (var j = 0; j < photos[size].navs.length; j++) {
        next = photos[size].navs[j].linkedPhotoId;
        photos[size].navs[j].linkedPhotoId = parseInt(next) - 1;
      }
    }

    newFloor.photos = photos;
    newFloor.save();
    console.log("done", i);
  }

}