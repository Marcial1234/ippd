var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Building = require('./buildings.model.js');

// bldg => floor => rooms
var FloorSchema = new mongoose.Schema({
  name: String,

  // is this a good name?
  parent: {
    ref: "Buildings",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // entry point, and it's more like index
  firstPhotoId: Number,

  // NOTICE the change from object to array ~
  // these are the 'rooms'
  photos: [{
      uri: String,
      gNotes: String,
      navs:  [
        {
          text: String,
          rotationY: Number,
          linkedPhotoId: Number,
        },
      ],
      notes: [
        {
          // changed this from 'type', due to reserved keyword
          Type: String,
          text: String,
          title: String,
          width: Number,
          height: Number,
          selected: Boolean,
          rotationY: Number,
          translateX: Number,
          // what's this? all of them have it...
          // "attribution": "Photo Credit to: Scott",
        },
      ],
    }
  ],

});

// Post-processing
FloorSchema.post("save", (doc) => {

  // adding this floor's ref to it's parent building
  Building.findById(doc.parent).exec((err, bldg) => {
    if (err) res.status(404).send(err);
    else {
      var newFloor = {
        hash: doc.id,
        name: doc.name,
      }

      bldg.floors.push(newFloor);

      Building.findByIdAndUpdate(doc.parent, bldg, {new: true},
        (err, updatedBldg) => {
          if (err) console.log(err);
          // else console.log("saving ~");
      });
    }
  });

});


// Create model from schema
var Floor = mongoose.model("Floors", FloorSchema);
// THIS CLEANS/FIXES SOME DB PROBLEMS
// this.collection.dropIndexes();

module.exports = Floor;