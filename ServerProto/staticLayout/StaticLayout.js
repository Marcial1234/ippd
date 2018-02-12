import React from 'react';
import {Text, View, VrButton, NativeModules} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

export default class StaticLayout extends React.Component {
  constructor(props){
    super(props);
    this.openOverlay = this.openOverlay.bind(this);
    this.test = this.test.bind(this);
    this.goHome = this.goHome.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentWillMount(){
    //will respond to the call for 'textUpdated', e is the value recieved
    RCTDeviceEventEmitter.addListener('textUpdated', e => {
    this.props.textInput(e);
    });
  }

  openOverlay(){
     NativeModules.DomOverlayModule.openOverlay(this.props.input);
  }

  test(){
    console.log("Static ", this.context);
  }

  goHome(){
    this.props.changeNextLocationId("000001");
  }
  zoomIn(){
    this.props.changeZoom(20);
  }
  zoomOut(){
    this.props.changeZoom(-20);
  }

  render() {
    return (
      <View>
        {/* The line below Displays the View only if "this.props.textInputActive" is true
          Using the && is a short way of doing it instead of
           this.props.textInputActive ? <View> : null */}
        {/*
          {this.props.StaticTextBox && <View style={styles.staticTBView}>
          <Text style={styles.staticTBText}>
            {this.props.input}
          </Text>
        </View>}
        */}
      <View style={styles.menu}>
        <VrButton style={styles.menuButton} onClick={this.goHome}>
          <Text style={styles.menuText}>Home</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.zoomIn}>
          <Text style={styles.menuText}>Zoom In</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.zoomOut}>
          <Text style={styles.menuText}>Zoom Out</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.openOverlay}>
          <Text style={styles.menuText}>Open Overlay</Text>
        </VrButton>
      </View>
      </View>
    );
  }
}
