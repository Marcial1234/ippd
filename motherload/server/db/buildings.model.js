var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

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

  city:        {type: String, required: true},
  name:        {type: String, required: true},
  state:       {type: String, required: true},
  num_floors:  {type: Number, required: true},
  
  // will be auto-populated
  long_state:  String,

  floors: [{
    number: Number,
    hash: {
      ref : "Rooms",
      type: mongoose.Schema.Types.ObjectId,
    },
    // structure?? for map creation...
  }],
});

BuildingSchema.pre("save", function(next) {
  // Pre-save processing ~

  // no need for the if really, but w/e ~
  if (!this.long_state)
    this.long_state = us_states_abbvs_to_long_name[this.state];

  console.log("saving ~");
  // console.log(this);
  next();
});

// Create model from schema
var Bldg = mongoose.model("Buildings", BuildingSchema);
// THIS CLEANS/FIXES SOME DB PROBLEMS
// this.collection.dropIndexes();

module.exports = Bldg;
