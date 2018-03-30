import React from 'react';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { AppRegistry, asset, Pano, Text, View} from 'react-vr';
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

let fullJSON, jsonPath, url;
const MAX_TEXTURE_HEIGHT = 720;
const MAX_TEXTURE_WIDTH = 4096;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;

// TODOs: 
// Get 'jsonPath' that is passed to 'VRInstance' in 'client.js', and attach it here/constructor
// dummy for now ~
jsonPath = "http://localhost:5001/search/1";

// UI changes:
// Save button on the "toggle" menus that will trigger backend PUTs for positions
// trigger backend PUTs on "Submit" on notes (including room notes)
// trigger backend DELETE on "Delete" buttons click
// format of the requests:
//    /edit/[building id]/[floor]/, {note obj}
//    /delete/[building id]/[floor]/[index]
// navigation endpoint:
//    /editNavs/[building id]/[floor]/, [new rotationY int]


class VRLayout extends React.Component{

  constructor(props){
    // console.log(props);
    // jsonPath = this.formatSearchQuery(props.jsonPath);

    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  formatSearchQuery(query){
    if (window.process.env.NODE_ENV === "production") {
      url = "http://" + window.location.host;
    }
    else {
      url = "http://localhost:5001";
    }

    return url + query;
  }

  handleMove(e){
    console.log(e);
  }

  // "handleInput" can listen for mouse clicks or key presses and perform actions accordingly
  // Use "onInput" inside a View. Ex: <View onInput={handleInput} style={styles.rootView}>
  handleInput(e){
    let event = e.nativeEvent.inputEvent;
  }

  componentDidMount() {
    // Gets the JSON data, and later initiallize component
    // This "fetch" works as a GET request

    console.log(this.props.jsonPath);
    console.log(this.props.jsonPath);
    console.log(this.props.jsonPath);

    fetch(this.props.jsonPath)
      .then(response => response.json())
      .then(responseData => {
        this.init(responseData);
      })
      .done();
    //asset(this.props.jsonPath).uri
  }

  componentWillUpdate(nextProps, nextState){
    if (nextProps.location.floors && this.props.location.floors !== nextProps.location.floors){
      let {currentFloor} = nextProps.location;
      let roomData = nextProps.location.floors[currentFloor];

      this.props.updatePhoto({
        zoomZ: 0,
        data: roomData,
        locationId: null,
        nextLocationId: roomData.firstPhotoId,
        rotation: roomData.firstPhotoRotation +
        (roomData.photos[roomData.firstPhotoId].rotationOffset || 0),
      });
    }
  }

  init(roomConfig) {
    fullJSON = roomConfig;
    let {currentFloor} = this.props.location;

    this.props.initFloors({
      floors: roomConfig.floors,
      rooms: roomConfig.floors[currentFloor].photos,
    })
  }

  render(){
    // map short names to state values that will be used.
    let {locationId, nextLocationId, data} = this.props.photo;
    let rot = this.props.photo.rotation;
    let trans = this.props.photo.translation;

    //console.log("Trans:", trans, "Rot:", rot);
    //map short names to functions that will be used.
    let {updatePhoto, changeLocationId, changeNextLocationId, changeZoom} = this.props;

    if (!data) {
      return null;
    }

    const photoData = (locationId && data.photos[locationId]) || null;
    const isLoading = nextLocationId !== locationId;
    //console.log("Props in render: ", this.props);

    const navs = (photoData && photoData.navs) || null;
    const notes = (photoData && photoData.notes) || null;
    const rotation = ((photoData && photoData.rotationOffset) || 0);
    //console.log(this.props.photo.rotation);
      return (
        <View onInput={this.handleInput}
          style={{
            transform: [
              {rotateX: + trans},
              {rotateY: - ((rot == 0) ? rotation : rot)},
            ]
          }}
          >
          <Pano
            style={{
              tintColor: isLoading ? 'grey' : 'white',
            }}
            onLoad={() => {changeLocationId(nextLocationId)}}
            source={asset(data.photos[nextLocationId].uri)}
          />

          <CylindricalPanel
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
                    translateX={degreesToPixels(rotation) * -1}
                  />}
                  {navs && <DisplayTooltips
                    data={data} tooltips={navs} ppm={PPM}
                    changeNextLocationId={changeNextLocationId} isLoading={isLoading}
                    degreesToPixels={degreesToPixels} notes={notes}
                  />}
              </View>
            </View>
          </CylindricalPanel>
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
  json: fullJSON,
  photo: state.photo,
  jsonPath: VRLayout.formatSearchQuery(state.jsonPath),
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
