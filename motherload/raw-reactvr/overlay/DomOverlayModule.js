import React from 'react';
import ReactDOM from 'react-dom';
import {Module} from 'react-vr-web';

import NoteOverlay from './NoteOverlay';
import SelectorOverlay from './SelectorOverlay';
import ConfirmOverlay from './ConfirmOverlay';

export default class DomOverlayModule extends Module {
  constructor(overlayContainer1, overlayContainer2, overlayContainer3) {
    super('DomOverlayModule');
    //rnContext will be used to refer to the React Native context
    //This allows communication with React VR
    this.rnContext = null;
    this.submit = this.submit.bind(this);
    this._overlayContainer1 = overlayContainer1;
    this._overlayContainer2 = overlayContainer2;
    this._overlayContainer3 = overlayContainer3;
    this.closeOverlay1 = this.closeOverlay1.bind(this);
    this.closeOverlay2 = this.closeOverlay2.bind(this);
    this.closeOverlay3 = this.closeOverlay3.bind(this);
    this.openOverlay1 = this.openOverlay1.bind(this);
    this.openOverlay2 = this.openOverlay2.bind(this);
    this.openOverlay3 = this.openOverlay3.bind(this);
    this.submitSelection = this.submitSelection.bind(this);
    this.submitGNotes = this.submitGNotes.bind(this);
    this.submitConfirmation = this.submitConfirmation.bind(this);
  }

  //This method call opens up the overlay for display.
  openOverlay1(text, title, type, gNotes) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayOpen1'
    ]);
    ReactDOM.render(
      <NoteOverlay text={text} title={title} type={type} gNotes={gNotes}
        onClose={this.closeOverlay1} submit={this.submit} submitGNotes={this.submitGNotes}/>,
      this._overlayContainer1
    );
  }
  openOverlay2(room, floor, floors, rooms) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'overlayOpen2'
    ]);
    ReactDOM.render(
      <SelectorOverlay room={room} rooms={rooms} floor={floor} floors={floors}
         onClose={this.closeOverlay2} submit={this.submitSelection}/>,
       this._overlayContainer2
    );
  }
  openOverlay3(index) {
    ReactDOM.render(
      <ConfirmOverlay index={index} submit={this.submitConfirmation}/>,
       this._overlayContainer3
    );
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

  closeOverlay3() {
    ReactDOM.unmountComponentAtNode(this._overlayContainer3);
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
    submitConfirmation(obj){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'deleteConfirm', obj,
      ]);
    }
}
