var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Floor = require('./floors.model.js');
var us_states_abbvs_to_long_name = require("./state_abbv_mapping");

// building => floors => room
var BuildingSchema = new mongoose.Schema({
  // dummy:
  // {
  //   "City": "Miami", 
  //   "Name": "Warehouse",
  //   "State": "FL",
  //   "Long_State": "Florida",
  //   "floors": 9,
  //   "rooms": "ref",
  // }

  name:        {type: String, required: true},
  city:        {type: String, required: true},
  state:       {type: String, required: true},
  
  // will be auto-populated
  long_state:  String,

  floors: [{
    name: String,
    hash: {
      ref : "Rooms",
      type: mongoose.Schema.Types.ObjectId,
    },
    // structure?? for map creation...
  }],
});

// Post-processing ~
BuildingSchema.post("save", (doc) => {
  // auto-populate .long_state
  var correctState = doc.long_state == us_states_abbvs_to_long_name[doc.state];
  if (!doc.long_state || !correctState) {
    doc.long_state = us_states_abbvs_to_long_name[doc.state];
    doc.save();
  }

  // console.log("saving ~");
});

// Create model from schema
var Bldg = mongoose.model("Buildings", BuildingSchema);
// THIS CLEANS/FIXES SOME DB PROBLEMS
// this.collection.dropIndexes();

module.exports = Bldg;
