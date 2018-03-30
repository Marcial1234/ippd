var mongoose = require("mongoose") ;
mongoose.Promise = global.Promise;

// bldg => floor => rooms
var FloorSchema = new mongoose.Schema({

  "room_parent": {
    ref: "Buildings",
    type: mongoose.Schema.Types.ObjectId,
  },
  // entry point, and it's more like index
  "firstPhotoId": String,

  // NOTICE the change from object to array ~
  "photos": [{
      "uri": String,
      "gNotes": String,
      "navs":  [
        {
          "text": String,
          "rotationY": Number,
          "linkedPhotoId": String,
        },
      ],
      "notes": [
        {
          "type": String,
          "text": String,
          "title": String,
          "width": Number,
          "height": Number,
          "selected": Boolean,
          "rotationY": Number,
          "translateX": Number,
          // what's this? all of them have it...
          // "attribution": "Photo Credit to: Scott",
        },
      ],
    }
  ],

  // rooms: [{
  //   floor: Number
  //   hash : {
  //     ref: 'Room',
  //     type: mongoose.Schema.Types.ObjectId,
  //   },
  // }],

});

FloorSchema.pre("save", function(next) {
  // Pre-save processing ~

  console.log("saving ~");
  // console.log(this);
  next();
});

// Create model from schema
var Floor = mongoose.model("Floors", FloorSchema) ;
// THIS CLEANS/FIXES SOME DB PROBLEMS
// this.collection.dropIndexes();

module.exports = Floor ;
