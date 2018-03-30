import React from 'react';
import ReactDOM from 'react-dom';
import {Module} from 'react-vr-web';

import TextboxOverlay from './TextboxOverlay';
import SelectorOverlay from './SelectorOverlay';

export default class DomOverlayModule extends Module {
  constructor(overlayContainer1, overlayContainer2) {
    super('DomOverlayModule');
    //rnContext will be used to refer to the React Native context
    //This allows communication with React VR
    this.rnContext = null;
    this.submit = this.submit.bind(this);
    this._overlayContainer1 = overlayContainer1;
    this._overlayContainer2 = overlayContainer2;
    this.closeOverlay1 = this.closeOverlay1.bind(this);
    this.closeOverlay2 = this.closeOverlay2.bind(this);
    this.openOverlay1 = this.openOverlay1.bind(this);
    this.openOverlay2 = this.openOverlay2.bind(this);
    this.submitSelection = this.submitSelection.bind(this);
    this.submitGNotes = this.submitGNotes.bind(this);
  }

  //This method call opens up the overlay for display.
  openOverlay1(text, title, type, gNotes) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayOpen1'
    ]);
    ReactDOM.render(
      <TextboxOverlay text={text} title={title} type={type} gNotes={gNotes}
        onClose={this.closeOverlay1} submit={this.submit} submitGNotes={this.submitGNotes}/>,
      this._overlayContainer1
    );
    // ReactDOM.render(
    //     <TextboxOverlay text={text} title={title} submit={this.submit}/>,
    //     this._overlayContainer
    //   );
  }
  openOverlay2(room, floor, floors) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayOpen2'
    ]);
    ReactDOM.render(
      <SelectorOverlay room={room}floor={floor} floors={floors}
         onClose={this.closeOverlay2} submit={this.submitSelection}/>,
       this._overlayContainer2
    );
    // ReactDOM.render(
    //     <TextboxOverlay text={text} title={title} submit={this.submit}/>,
    //     this._overlayContainer
    //   );
  }


  closeOverlay1() {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayClose1'
    ]);
    ReactDOM.unmountComponentAtNode(this._overlayContainer1);
  }

  closeOverlay2() {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayClose2'
    ]);
    ReactDOM.unmountComponentAtNode(this._overlayContainer2);
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
    submitGNotes(obj){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'updateGNotes', obj,
      ]);
    }
    submitSelection(obj){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'selectFloorRoom', obj,
      ]);
    }
}
