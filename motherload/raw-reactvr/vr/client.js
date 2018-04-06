// Auto-generated content.
// This file contains the boilerplate to set up your React app.
// If you want to modify your application, start in "index.vr.js"

// Auto-generated content.
import {VRInstance, Module} from 'react-vr-web';
import './process'; //necessary from DOMOverlay instructions
import DomOverlayModule from '../overlay/DomOverlayModule';

class ClientModule extends Module {
  constructor() {
    super('ClientModule');
    this.rnContext = null;
    this.json = null;
  }

  getRotation() {
    let obj = window.playerCamera.rotation;
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'cameraRot', obj,
    ]);
  }

  getJson() {
    let obj = this.json;
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'getJson', obj,
    ]);
  }

  getWindow() {
    let obj = this.json;
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'getJson', obj,
    ]);
  }
  _setRNContext(rnctx) {
      this.rnContext = rnctx;
    }
  _setJson(json) {
    this.json = json;
  }

    viewStuff(){
      console.log(decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")));
    }
}

// Gets the url?key=values
function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function init(bundle, parent, options) {

  // Grabbing url query to search for a specific building
  //  => url?key=values
  let bldg = getQueryStringValue("building");
  console.log("GQS", getQueryStringValue("building"));
  if (!bldg) bldg = "5abed5d1571e152138346d24";
  let floor = "5ac6d11c0aa88b2dec945e0e";
  // let room = getQueryStringValue("room");
  // if (!room) bldg = "0";

  // TODO: change construction of this to a "/" separated array join ~
  // jsonPath = "/api/building/" + bldg;
  let jsonPath = ["", "api", "floor", floor].join("/");

  //jsonPath = "/api/" + bldg;
  //
  // console.log("query", jsonPath);
  // console.log("query", jsonPath);
  // console.log("query", jsonPath);

  //create div from overlay
  const domOverlayContainer1 = document.createElement('div');
  const domOverlayContainer2 = document.createElement('div');
  domOverlayContainer1.id = 'dom-overlay1';
  domOverlayContainer2.id = 'dom-overlay2';
  //create instance of module
  const domOverlayModule = new DomOverlayModule(domOverlayContainer1, domOverlayContainer2);
  const clientModule = new ClientModule();


  const vr = new VRInstance(bundle, 'VRLayout', parent, {
    // Add custom options here, still some work to be done...
    // when it renders it for a 2nd time it goes away...
    ...options,

    hideFullscreen: true, //hides the button
    //register dom overlay
    nativeModules: [domOverlayModule, clientModule],
  });

  clientModule._setRNContext(vr.rootView.context);
  clientModule._setJson(jsonPath);

  function testIt(){
    //document.body.children[2].children[0].children[2].click();
    // console.log(vr);
    return vr.player.camera.rotation;
  }

  vr.player._wrapper.appendChild(domOverlayContainer1);
  vr.player._wrapper.appendChild(domOverlayContainer2);
  vr.render = function() {
    // Any custom behavior you want to perform on each frame goes here
  };
  // Begin the animation loop
  // Adds a camera and attaches the "Menu" component to it
  // This is for Stationary ReactVR
  vr.scene.add(vr.camera());
  // console.log(vr.rootView.context);
  vr.mountComponent('StaticLayout', {},  vr.camera());

  vr.start();
  //"vr.rootView.context" is the context for the VR portion of the app
  //This is how the overlay(React) can connect with ReactVR
  domOverlayModule._setRNContext(vr.rootView.context);

  // zoom code
  window.playerCamera = vr.player._camera;
  window.vr = vr;
  window.ondblclick = onRendererDoubleClick;
  window.onmousewheel = onRendererMouseWheel;
  vr.rootView.context.worker.addEventListener('message', onVRMessage);
  // RCTDeviceEventEmitter.addListener('testIt', () => {
  //   console.log("VR:", vr.player.overlay.compass);
  // });

  return vr;
}

window.ReactVR = { init };

// more zoom f(x)s
function onVRMessage(e) {
  var type = e.data.type;

  // watching out for javascript string comparizons...
  if (type == 'sceneChanged' && window.playerCamera.zoom != 1) {
    window.playerCamera.zoom = 1;
    window.playerCamera.updateProjectionMatrix();
  }
  else if (type == "sceneLoadStart")
    document.getElementById('loader').style.display = 'block';
  else if (type == "sceneLoadEnd")
    document.getElementById('loader').style.display = 'none';
}

import * as THREE from 'three';
function get3DPoint(camera, x, y) {
  var mousePosition = new THREE.Vector3(x, y, 0.5);
  mousePosition.unproject(camera);

  var dir = mousePosition.sub(camera.position).normalize();
  dir.y = dir.y + 0.05;
  return dir;
}

function onRendererDoubleClick() {
  var x = 2 * (event.x / window.innerWidth) - 1;
  var y = 1 - 2 * (event.y / window.innerHeight);
  var coordinates = get3DPoint(window.playerCamera, x, y);
  vr.rootView.context.worker.postMessage({ type: "newCoordinates", coordinates: coordinates });
}

function onRendererMouseWheel() {
  // Fliped the '<' for non-reverse scroll, dont like reverse scroll
  if (event.deltaY < 0) {
    if (window.playerCamera.zoom > 1) {
      window.playerCamera.zoom -= 0.1;
      window.playerCamera.updateProjectionMatrix();
    }
  } else {
    if (window.playerCamera.zoom < 3) {
      window.playerCamera.zoom += 0.1;
      window.playerCamera.updateProjectionMatrix();
    }
  }
}
