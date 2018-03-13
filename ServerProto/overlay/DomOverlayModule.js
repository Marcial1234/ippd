import React from 'react';
import ReactDOM from 'react-dom';
import {Module} from 'react-vr-web';

import TextboxOverlay from './TextboxOverlay';
import SelectorOverlay from './SelectorOverlay';

export default class DomOverlayModule extends Module {
  constructor(overlayContainer) {
    super('DomOverlayModule');
    //rnContext will be used to refer to the React Native context
    //This allows communication with React VR
    this.rnContext = null;
    this._closeOverlay = this.closeOverlay.bind(this);
    this._overlayContainer = overlayContainer;
    this.submit = this.submit.bind(this);
    this.submitSelection = this.submitSelection.bind(this);
  }

  //This method call opens up the overlay for display.
  openOverlay(type, text, title, room, floor, building, bldgs) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayOpen'
    ]);
    ReactDOM.render(
      <TextboxOverlay type={type} text={text} title={title} room={room}
        floor={floor} building={building} bldgs={bldgs}
         onClose={this._closeOverlay} submit={this.submit} submitSelection={this.submitSelection}/>,
      this._overlayContainer
    );
    // ReactDOM.render(
    //     <TextboxOverlay text={text} title={title} submit={this.submit}/>,
    //     this._overlayContainer
    //   );
  }


  closeOverlay() {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayClose'
    ]);
    ReactDOM.unmountComponentAtNode(this._overlayContainer);
  }

  _setRNContext(rnctx) {
      this.rnContext = rnctx;
    }

    //The first part of the callFunction is 'RCTDeviceEventEmitter', 'emit'
    //This will always stay as is
    //'textUpdated' is the name of the listener created in StaticLayout
    //'text' is value we are returning from here.
    submit(obj){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'updateText', obj,
      ]);
    }
    submitSelection(obj){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'selectAll', obj,
      ]);
    }
}
