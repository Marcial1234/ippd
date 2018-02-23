var config_loader = require('dotenv');
config_loader.load();

function startServer() {
  var app = require("./server/app");
  var server = app.start();
}

function waitForEnvironmentVariables(count) {
  // we need this else the ".env" is worthless
  
  // if (process.env.CLOUD_MONGODB_URI)
  if (process.env.LOCAL_MONGODB_URI)
    startServer();
  else {
    // console.log("loading...", count);
    // Recurses ~1100 times... wow
    config_loader.load();
    waitForEnvironmentVariables(count+1);
  }
}

waitForEnvironmentVariables(1);
