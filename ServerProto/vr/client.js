// Auto-generated content.
// This file contains the boilerplate to set up your React app.
// If you want to modify your application, start in "index.vr.js"

// Auto-generated content.
import {VRInstance} from 'react-vr-web';
import './process'; //necessary from DOMOverlay instructions
import DomOverlayModule from '../overlay/DomOverlayModule';

function init(bundle, parent, options) {

  //create div from overlay
  const domOverlayContainer = document.createElement('div');
  domOverlayContainer.id = 'dom-overlay';
  //create instance of module
  const domOverlayModule = new DomOverlayModule(domOverlayContainer);

  const vr = new VRInstance(bundle, 'VRLayout', parent, {
    // Add custom options here
    hideFullscreen: true, //hides the button
    ...options,
    //register dom overlay
    nativeModules: [domOverlayModule],
  });

  vr.player._wrapper.appendChild(domOverlayContainer);
  vr.render = function() {
    // Any custom behavior you want to perform on each frame goes here
  };
  // Begin the animation loop
  //Adds a camera and attaches the "Menu" component to it
  //This is for Stationary ReactVR
  vr.scene.add(vr.camera());
  // console.log(vr.rootView.context);
  vr.mountComponent('StaticLayout', {},  vr.camera());

  vr.start();
  //"vr.rootView.context" is the context for the VR portion of the app
  //This is how the overlay(React) can connect with ReactVR
  domOverlayModule._setRNContext(vr.rootView.context);
  return vr;
}

window.ReactVR = { init };
