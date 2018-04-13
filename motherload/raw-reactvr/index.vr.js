import React from 'react';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { AppRegistry, asset, Pano, Text, View, NativeModules} from 'react-vr';
import CylindricalPanel from 'CylindricalPanel';

import * as mode from "./actions/modeActions";
import * as photo from "./actions/photoActions";
import * as location from "./actions/locationActions";

import store from "./static_assets/store";
import styles from "./static_assets/styles";

import TextboxVr from './staticLayout/TextboxVr';
import StaticLayout from './staticLayout/StaticLayout';

import NavButton from './components/NavButton';
import InfoButton from './components/InfoButton';
import LoadingSpinner from './components/LoadingSpinner';
import DisplayTooltips from './components/DisplayTooltips';

let loc;
const MAX_TEXTURE_HEIGHT = 720;
const MAX_TEXTURE_WIDTH = 4096;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

class VRLayout extends React.Component{

  constructor() {
    super();
    // RCTDeviceEventEmitter.addListener('getJson', obj => {
    //   jsonPath = obj;
    // });
    // NativeModules.ClientModule.getJson();
    RCTDeviceEventEmitter.addListener('getLocation', obj => {
      loc = obj;
    });
    NativeModules.ClientModule.getLocation();

    this.handleMove = this.handleMove.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  // TODO: can we just use the 'formatSearchQuery' in StaticLayout?
  // Returns the correct url for DB queries for BOTH dev and production
  formatSearchQuery(query) {
    let url;
    if (window.process.env.NODE_ENV === "production") {
      url = window.location.origin;
      // this will return the domain of the current site
      // 'http[s]://[domain].[extension]'
    }
    else {
      url = "http://localhost:5001";
    }

    return [url, query].join("/");
  }

  handleMove(e) {
    console.log(e);
  }

  // "handleInput" can listen for mouse clicks or key presses and perform actions accordingly
  // Use "onInput" inside a View. Ex: <View onInput={handleInput} style={styles.rootView}>
  handleInput(e) {
    let event = e.nativeEvent.inputEvent;
  }

  componentDidMount() {

    // Gets the JSON data, and later initiallize component
    // This "fetch" works as a GET request

    setTimeout(function() {

      console.log(loc);

      let buildingPath = ["api", "building", loc.bldg].join("/");

      fetch(this.formatSearchQuery(buildingPath))
        .then(response => response.json())
        .then(responseData => {
          console.log("Building:", responseData);
          let floor = responseData.floors[loc.floor].hash;

          let floorPath = ["api", "floor", floor].join("/");

          fetch(this.formatSearchQuery(floorPath))
            .then(response => response.json())
            .then(responseData => {
              // console.log("Floor:", responseData)
              this.init(responseData);
            })
            .done();
        })
        .done();
    }.bind(this), 50);

    //asset(this.props.jsonPath).uri
  }

  componentWillUpdate(nextProps, nextState) {
     // console.log("Component Will Update!:", nextProps.photo.nextLocationId, this.props.photo.nextLocationId);
    if ( (nextProps.photo.nextLocationId == null)
      || (nextProps.photo.locationId !== nextProps.photo.nextLocationId )
      || this.props.location.currentFloor != nextProps.location.currentFloor) {
      // let {currentFloor} = nextProps.location;
      // console.log("Trying to update");
      console.log(nextProps);
      let roomData = nextProps.location.rooms;
      let {nextLocationId} = nextProps.photo;
      let room;

      if(typeof roomData[nextLocationId] === 'undefined'){
        room = roomData[0];
      }
      else{
        room = roomData[nextLocationId];
      }
        this.props.updatePhoto({
          zoomZ: 0,
          data: room,
          locationId: nextLocationId,
          nextLocationId: nextLocationId ? nextLocationId : 0,
          rotation: 0,
          // rotation: roomData.firstPhotoRotation +
          // (roomData.photos[roomData.firstPhotoId].rotationOffset || 0),
        });
        this.props.setPreview(loc.preview);
    }
  }

  init(roomConfig) {
    fullJSON = roomConfig;
    let buildingPath = ["api", "building", roomConfig.parent].join("/");
    // console.log("#Init", roomConfig);

    fetch(this.formatSearchQuery(buildingPath))
      .then(response => response.json())
      .then(responseData => {
        let building = responseData;
        this.props.initFloors({
          floors: building.floors,
          rooms: roomConfig.photos,
        });
        this.props.changeNextLocationId(loc.room);
      })
      .done();
  }

  render() {
    // map short names to state values that will be used.
    let {locationId, nextLocationId, data} = this.props.photo;

    if (!data) {
      return null;
    }
    // console.log("Data", data);

    let rot = this.props.photo.rotation;
    let trans = this.props.photo.translation;

    // map short names to functions that will be used.
    let {updatePhoto, changeLocationId, changeNextLocationId, changeZoom} = this.props;
    //console.log("Props in render: ", this.props);

    const isLoading = nextLocationId !== locationId;
    const navs = (data && data.navs) || null;
    const notes = (data && data.notes) || null;
    const rotation = (data && data.rotationOffset) || null;
    // {rotateY: - ((rot == 0) ? 0: rot)},
// source={asset(data.uri)}
// source={{uri: 'http://res.cloudinary.com/serverful/image/upload/v1521187672/1521187637743.jpg'}}
    return (
      <View onInput={this.handleInput}
        style={{
          transform: [
            {rotateX: + trans},
            {rotateY: - rot},
          ]
        }}
        >
        <Pano
          style={{
            tintColor: isLoading ? 'grey' : 'white',
          }}
          onLoad={() => {
            // console.log("LOADED:", nextLocationId);
            changeLocationId(nextLocationId)
          }}
          source={asset(data.uri)}
        />

      {this.props.photo.preview != "true" && <CylindricalPanel
          layer={{
            width: MAX_TEXTURE_WIDTH,
            height: MAX_TEXTURE_HEIGHT,
            density: MAX_TEXTURE_WIDTH,
          }}
          style={{ position: 'absolute'}}
          >

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT,
            }}>
            {/* Need container view, else using absolute position on buttons removes them from cylinder */}

          {/* Main Content View */}
            <View>
              {/* Show a spinner while first pano is loading */}
              {locationId == null && <LoadingSpinner
                  pixelsPerMeter={PPM}
                  style={{layoutOrigin: [0.5, 0.5]}}

                  // Undo the rotation so spinner is centered
                  translateX={degreesToPixels(0) * -1}
                />}
                {navs && <DisplayTooltips
                  data={data} tooltips={navs} ppm={PPM}
                  changeNextLocationId={changeNextLocationId} isLoading={isLoading}
                  degreesToPixels={degreesToPixels} notes={notes}
                />}
            </View>
          </View>
        </CylindricalPanel>}
      </View>
    );
  }
}

// Start of "Redux"
// in "mapStateToProps", map names to use values returned from reducer
const mapStateToProps = state => ({
  name: state.user.name,
  text: state.mode.text,
  input: state.mode.input,
  VRTextBox: state.mode.VRTextBox,
  StaticTextBox: state.mode.StaticTextBox,
  // photo props
  photo: state.photo,
  location: state.location,
});

//in "mapDispatchToProps", map names to use functions returned from action
//"mode" and "photo" are imported at the top of this file.
const mapDispatchToProps = dispatch => ({
  // show: () => dispatch(mode.createActiveMode()),
  // hide: () => dispatch(mode.viewActiveMode()),
  // textOn: () => dispatch(mode.textInputMode()),
  // textInput: (text) => dispatch(mode.textInput(text)),
  focusNote: (obj) => dispatch(photo.focusNote(obj)),
  changeZoom: (zoom) => dispatch(photo.changeZoom(zoom)),
  updateData: (data) => dispatch(photo.updateData(data)),
  updateNotes: (notes) => dispatch(photo.updateNotes(notes)),
  updateGNotes: (notes) => dispatch(photo.updateGNotes(notes)),
  updatePhoto: (nextPhoto) => dispatch(photo.updatePhoto(nextPhoto)),
  changeLocationId: (locationId) => dispatch(photo.changeLocationId(locationId)),
  changeNextLocationId: (locationId) => dispatch(photo.changeNextLocationId(locationId)),
  setPreview: (preview) => dispatch(photo.setPreview(preview)),

  // any difference between these 2 groups?
  initFloors: (obj) => dispatch(location.initFloors(obj)),
  selectFloor: (floor) => dispatch(location.selectFloor(floor)),
});

//This sends the variables and functions to be referenced as "this.props"
const VRContainer = connect(mapStateToProps, mapDispatchToProps)(VRLayout);
const StaticContainer = connect(mapStateToProps, mapDispatchToProps)(StaticLayout);

const VRProvider = () =>
  <Provider store={store}>
    <VRContainer />
  </Provider>;

const StaticProvider = () =>
  <Provider store={store}>
    <StaticContainer />
  </Provider>;


AppRegistry.registerComponent('StaticLayout', () => StaticProvider);
AppRegistry.registerComponent("VRLayout", () => VRProvider);
