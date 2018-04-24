import React from 'react';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { AppRegistry, asset, Pano, Text, View, NativeModules} from 'react-vr';
import CylindricalPanel from 'CylindricalPanel';

import * as location from "./actions/locationActions";

import store from "./static_assets/store";
import styles from "./static_assets/styles";

import StaticLayout from './staticLayout/StaticLayout';

import NavButton from './components/NavButton';
import InfoButton from './components/InfoButton';
import LoadingSpinner from './components/LoadingSpinner';
import DisplayTooltips from './components/DisplayTooltips';

let loc;
const MAX_TEXTURE_HEIGHT = 1000;
const MAX_TEXTURE_WIDTH = 3000;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

class VRLayout extends React.Component{

  constructor() {
    super();

    //adds listener waiting for call from client.js
    RCTDeviceEventEmitter.addListener('getLocation', obj => {
      loc = obj;
    });
    //call function in client js, handled by above listener
    NativeModules.ClientModule.getLocation();
  }

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

  componentDidMount() {

    // Gets the JSON data, and later initiallize component
    // This fetch works as a GET request

    //set timeout to delay long enough for RCTDeviceEventEmitter to send and receive
    setTimeout(function() {

      let buildingPath = ["api", "building", loc.bldg].join("/");

      fetch(this.formatSearchQuery(buildingPath))
        .then(response => response.json())
        .then(responseData => {
          let floor;
          //if no floor is passed, or floor passed doesn't exist, default to first floor
          if (typeof responseData.floors[loc.floor] === 'undefined' || loc.floor === "") {
            floor = responseData.floors[0].hash;
          }
          else {
            floor = responseData.floors[loc.floor].hash;
          }

          let floorPath = ["api", "floor", floor].join("/");

          fetch(this.formatSearchQuery(floorPath))
            .then(response => response.json())
            .then(responseData => {
              if (loc.room === "") {
                // if the 'firstPhotoId' room exists, show it, else choose the first room as default
                if (responseData.firstPhotoId)
                  loc.room = responseData.firstPhotoId;
                else
                  loc.room = 0;
              }
              this.init(responseData);
            })
            .done();
        })
        .done();
    }.bind(this), 50);
  }

  componentWillUpdate(nextProps, nextState) {
    //update location if it's on first run or room or floor has changed
    if ( (nextProps.location.nextLocationId == null)
      || (nextProps.location.locationId !== nextProps.location.nextLocationId )
      || this.props.location.currentFloor != nextProps.location.currentFloor) {

      let rooms = nextProps.location.rooms;

      let {nextLocationId} = nextProps.location;
      let room;

      if (typeof rooms[loc.room] === 'undefined' || loc.room === "") {
        // if the 'firstPhotoId' room exists, show it, else choose the first room as default
        if (rooms.firstPhotoId){
          room = rooms.firstPhotoId
        }
        else
          room = 0;
      }
      else if (nextLocationId){
        room = nextLocationId;
      }
      else {
        room = loc.room
      }
        this.props.updatelocation({
          data: rooms[room],
          locationId: room,
          nextLocationId: room ? room : 0,
        });
        this.props.setPreview(loc.preview);
    }
  }

  init(roomConfig) {
    let buildingPath = ["api", "building", roomConfig.parent].join("/");

    fetch(this.formatSearchQuery(buildingPath))
      .then(response => response.json())
      .then(responseData => {
        let building = responseData;
        this.props.initFloors({
          floors: building.floors,
          rooms: roomConfig.photos,
        });
        this.props.selectFloor(loc.floor);
      })
      .done();
  }

  render() {
    // map short names to state values that will be used.
    let {locationId, nextLocationId, data} = this.props.location;

    //only continue if data is loaded
    if (!data) {
      return null;
    }

    let rot = this.props.location.rotation;
    // map short names to functions that will be used.
    let {updatelocation, changeLocationId, changeNextLocationId, changeZoom} = this.props;

    const isLoading = nextLocationId !== locationId;
    const navs = (data && data.navs) || null;
    const notes = (data && data.notes) || null;
    const rotation = (data && data.rotationOffset) || null;

    return (
      <View
        style={{
          transform: [
            {rotateY: - rot},
          ]
        }}
        >
        <Pano
          style={{
            tintColor: isLoading ? 'grey' : 'white',
          }}
          onLoad={() => {
            changeLocationId(nextLocationId)
          }}
          source={ loc.preview == "" ? asset(data.uri) : asset(loc.preview)}
        />

      {this.props.location.preview == "" && <CylindricalPanel
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
    // location props
  location: state.location,
});

//in "mapDispatchToProps", map names to use functions returned from action
//"location" is imported at the top of this file.
const mapDispatchToProps = dispatch => ({
  focusNote: (obj) => dispatch(location.focusNote(obj)),
  updateData: (data) => dispatch(location.updateData(data)),
  updateNotes: (notes) => dispatch(location.updateNotes(notes)),
  updateGNotes: (notes) => dispatch(location.updateGNotes(notes)),
  updatelocation: (nextlocation) => dispatch(location.updatelocation(nextlocation)),
  changeLocationId: (locationId) => dispatch(location.changeLocationId(locationId)),
  changeNextLocationId: (locationId) => dispatch(location.changeNextLocationId(locationId)),
  setPreview: (preview) => dispatch(location.setPreview(preview)),
  initFloors: (obj) => dispatch(location.initFloors(obj)),
  selectFloor: (floor) => dispatch(location.selectFloor(floor)),
  setRooms: (rooms) => dispatch(location.setRooms(rooms)),
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
