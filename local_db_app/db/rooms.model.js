var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

// building => floors => room
var RoomSchema = new mongoose.Schema({

  // need ref room... or not

  // ROTATION offsets (think pivot points)
  x_rotation_offset: Number,
  y_rotation_offset: Number,
  z_rotation_offset: Number,

  // TRANSLATION offsets (think walking)
  x_translation_offset: Number,
  y_translation_offset: Number,
  z_translation_offset: Number,

  uri:  {type: String, required: true},
  tooltips:  Array,
  // 
  // "tooltips": [
  //   {
  //     "type": "textblock",
  //     "title": "Lockers",
  //     "text": "Full of Things",
  //     "attribution": "Photo Credit to: Scott",
  //     "rotationY": 170,
  //     "translateX": 100,
  //     "width": 1.3,
  //     "height": 1.5
  //   },
  // ]
  // 

  adjacent_rooms:  Array,
  // 
  // "adjacent_rooms": [
  //   {
  //     "rotationY": 0,
  //     "text": "IPPD Room",
  //     "linkedPhotoId": "113344"
  //   }
  // ]
  // 
});

RoomSchema.pre('save', function(next) {
  // Pre-save processing ~
  // var currentDate = new Date();
  // this.updated_at = currentDate;
  //
  // if (!this.created_at)
  //   this.created_at = currentDate;

  console.log("saving ~");
  // console.log(this);
  next();
});

// Create Room model from schema
var Room = mongoose.model('Rooms', RoomSchema) ;
// THIS CLEANS/FIXES SOME DB PROBLEMS
// this.collection.dropIndexes();

module.exports = Room ;
