import React from 'react';
import ReactDOM from 'react-dom';
import {Module} from 'react-vr-web';

import TextboxOverlay from './TextboxOverlay';

export default class DomOverlayModule extends Module {
  constructor(overlayContainer) {
    super('DomOverlayModule');

    //rnContext will be used to refer to the React Native context
    //This allows communication with React VR
    this.rnContext = null;
    this._closeOverlay = this.closeOverlay.bind(this);
    this._overlayContainer = overlayContainer;
    this.submit = this.submit.bind(this);
  }

  // This method call opens up the overlay for display.
  openOverlay(text, title) {
    ReactDOM.render(
      <TextboxOverlay title={title} text={text} onClose={this._closeOverlay} submit={this.submit}/>,
      this._overlayContainer
    );
  }
  openBlankOverlay() {
    ReactDOM.render(
      <TextboxOverlay onClose={this._closeOverlay} submit={this.submit}/>,
      this._overlayContainer
    );
  }

  closeOverlay() {
    ReactDOM.unmountComponentAtNode(this._overlayContainer);
  }

  _setRNContext(rnctx) {
      this.rnContext = rnctx;
    }

    //The first part of the callFunction is 'RCTDeviceEventEmitter', 'emit'
    //This will always stay as is
    //'textUpdated' is the name of the listener created in StaticLayout
    //'text' is value we are returning from here.
    submit(text){
      this.rnContext.callFunction('RCTDeviceEventEmitter', 'emit', [
        'updateText', text,
      ]);
    }
}
