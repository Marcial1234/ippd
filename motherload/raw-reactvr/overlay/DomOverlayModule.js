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
    this.closeNotes = this.closeNotes.bind(this);
    this.closeSelector = this.closeSelector.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.openNotes = this.openNotes.bind(this);
    this.openSelector = this.openSelector.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.submitSelection = this.submitSelection.bind(this);
    this.submitGNotes = this.submitGNotes.bind(this);
    this.submitConfirmation = this.submitConfirmation.bind(this);
  }

  //This method call opens up the overlay for display.
  openNotes(text, title, type, gNotes) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'openNotes'
    ]);
    ReactDOM.render(
      <NoteOverlay text={text} title={title} type={type} gNotes={gNotes}
        onClose={this.closeNotes} submit={this.submit} submitGNotes={this.submitGNotes}/>,
      this._overlayContainer1
    );
  }
  openSelector(room, floor, floors, rooms) {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'openSelector'
    ]);
    ReactDOM.render(
      <SelectorOverlay room={room} rooms={rooms} floor={floor} floors={floors}
         onClose={this.closeConfirm} submit={this.submitSelection}/>,
       this._overlayContainer2
    );
  }
  openConfirm(index) {
    ReactDOM.render(
      <ConfirmOverlay index={index} submit={this.submitConfirmation}/>,
       this._overlayContainer3
    );
  }


  closeNotes() {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'closeNotes'
    ]);
    ReactDOM.unmountComponentAtNode(this._overlayContainer1);
  }

  closeSelector() {
    this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
      'closeSelector'
    ]);
    ReactDOM.unmountComponentAtNode(this._overlayContainer2);
  }

  closeConfirm() {
    ReactDOM.unmountComponentAtNode(this._overlayContainer3);
  }

  _setRNContext(rnctx) {
      this.rnContext = rnctx;
    }

    //The first part of the callFunction is 'RCTDeviceEventEmitter', 'emit'
    //This will always stay as is
    //'textUpdated' is the name of the listener created in StaticLayout
    //'text' is value returned here
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
