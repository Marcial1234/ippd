var mongoose = require('mongoose') ;
mongoose.Promise = global.Promise;

var PanoramaSchema = new mongoose.Schema({
  floor : String,
  base64: String,
  // Add more here
});

// On save preprocessing
PanoramaSchema.pre('save', function(next) {
  // var currentDate = new Date();
  // this.updated_at = currentDate;

  // // Fill in fields if missing
  // if (!this.status)
  //   this.status = "RECEIVED";
  // else
  //   this.status = this.status.toUpperCase();

  // // TODO: Enforce all uppercase in server too
  // if (!this.type)
  //   this.type = "Auto Panoramic";

  next();
});

// Create Panoramic model from schema
var Panorama = mongoose.model('Panorama', PanoramaSchema) ;

// Export Panoramic model to application
module.exports = Panorama ;
