import {VRInstance, Module} from 'react-vr-web';
import './process'; //necessary from DOMOverlay instructions
import DomOverlayModule from '../overlay/DomOverlayModule';

//ClientModule is used to give other files access to functions and variables in client.js
class ClientModule extends Module {
  constructor() {
    super('ClientModule');
    this.rnContext = null;
    this.location = null;
  }

  getRotation() {
    let obj = window.playerCamera.rotation;
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'cameraRot', obj,
    ]);
  }

  getLocation() {
    let obj = this.location;
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'getLocation', obj,
    ]);
  }

  _setRNContext(rnctx) {
    this.rnContext = rnctx;
  }

  _setLocation(location) {
    this.location = location;
  }

}

// Gets the url?key=values. Searches for 'key' in URL and returns value from "key=value"
function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function init(bundle, parent, options) {

  // Get values from URL
  //  => url?key=values
  let location = {
    bldg: getQueryStringValue("bldg"),
    floor: getQueryStringValue("floor"),
    room: getQueryStringValue("room"),
    preview: getQueryStringValue("preview"),
  }

    // create div for overlays
  const domOverlayContainer1 = document.createElement('div');
  const domOverlayContainer2 = document.createElement('div');
  const domOverlayContainer3 = document.createElement('div');
  domOverlayContainer1.id = 'note-overlay';
  domOverlayContainer2.id = 'selector-overlay';
  domOverlayContainer3.id = 'confirmation-overlay';

  //create instance of module, pass the containers
  const domOverlayModule = new DomOverlayModule(domOverlayContainer1, domOverlayContainer2, domOverlayContainer3);
  const clientModule = new ClientModule();

  const vr = new VRInstance(bundle, 'VRLayout', parent, {
    ...options,

    hideFullscreen: true, //hides the button
    //register domOverlay and client for use outside of client.js
    nativeModules: [domOverlayModule, clientModule],
  });



  vr.player._wrapper.appendChild(domOverlayContainer1);
  vr.player._wrapper.appendChild(domOverlayContainer2);
  vr.player._wrapper.appendChild(domOverlayContainer3);

  // Adds a camera and attaches the "Menu" component to it
  // This is for Stationary ReactVR
  vr.scene.add(vr.camera());
  vr.mountComponent('StaticLayout', {},  vr.camera());

  vr.start();
  //sets the context as the VR context, so they'll both reference the same
  domOverlayModule._setRNContext(vr.rootView.context);
  clientModule._setRNContext(vr.rootView.context);
  clientModule._setLocation(location);

  // zoom code
  window.playerCamera = vr.player._camera;
  window.vr = vr;
  window.ondblclick = onRendererDoubleClick;
  window.onmousewheel = onRendererMouseWheel;
  vr.rootView.context.worker.addEventListener('message', onVRMessage);

  return vr;
}

window.ReactVR = { init };

// more zoom f(x)s
function onVRMessage(e) {
  var type = e.data.type;

  // watching out for javascript string comparisons...
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
  // Fliped the '<' for non-reverse scroll
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
