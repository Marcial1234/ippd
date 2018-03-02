import React from 'react';
import { connect, Provider } from "react-redux";
import { AppRegistry, asset, Pano, Text, View} from 'react-vr';
import { createStore } from "redux";
import CylindricalPanel from 'CylindricalPanel';

import store from "./vr/store";
import * as mode from "./actions/modeActions";
import * as photo from "./actions/photoActions";
import styles from './static_assets/styles'
import StaticLayout from './staticLayout/StaticLayout';
import TextboxVr from './staticLayout/TextboxVr';
import NavButton from './NavButton';
import InfoButton from './InfoButton';
import LoadingSpinner from './LoadingSpinner';
import DisplayTooltips from './DisplayTooltips';

const MAX_TEXTURE_HEIGHT = 720;
const MAX_TEXTURE_WIDTH = 4096;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
class VRLayout extends React.Component{

  static defaultProps = {
    // This is the source for all Panoramic Data, for now
    // Eventually need to have a DB and point that data/JSON to this ~
    // data in this object can be later accessed by 'this.prop.[key_name]'
    tourSource: 'PhotoAssets.json',
  };
    constructor(props){
      super(props);
      this.handleInput = this.handleInput.bind(this);
      this.handleMove = this.handleMove.bind(this);
    }

    handleMove(e){
      console.log(e);
    }

    //"handleInput" can listen for mouse clicks or key presses and perform actions accordingly
    //Use "onInput" inside a View. Ex: <View onInput={handleInput} style={styles.rootView}>
    handleInput(e){
      let event = e.nativeEvent.inputEvent;
      // if(event.eventType == "click"){
      //   let notes = this.props.photo.notes;
      //   let index = -1;
      //   for (let i = 0; i < notes.length; i++){
      //     if(notes[i].selected == true){
      //       index = i;
      //       break;
      //     }
      //   }
      //   if (index != -1){
      //     console.log(event);
      //     let dist = {
      //       x: -event.viewportX,
      //       y: -event.viewportY,
      //     }
      //     let obj = {
      //       rotation: notes[index].rotationY,
      //       translation: notes[index].translateX
      //     }
      //     this.props.focusNote(obj);
      //     console.log(dist.x);
      //     console.log(dist.y);
      //     console.log(notes[index]);
      //     //need to figure out what to do at 180 degrees
      //     if(notes[index].rotationY <= -180 || notes[index].rotationY >= 180){
      //       notes[index].rotationY *=-1;
      //     }
      //     notes[index].rotationY +=dist.x*60;
      //     notes[index].translateX +=dist.y*30;
      //
      //     //
      //     // console.log(notes[this.state.tooltipID].rotationY);
      //     this.props.updateNotes(notes);
      //   }
      // }
    }

    componentDidMount() {
      // Gets the json file, and later initiallizes the component
      fetch(asset(this.props.tourSource).uri)
        .then(response => response.json())
        .then(responseData => {
          this.init(responseData);
        })
        .done();
    }

    init(tourConfig) {
      this.props.updatePhoto({
        zoomZ: 0,
        data: tourConfig,
        locationId: null,
        nextLocationId: tourConfig.firstPhotoId,
        rotation: tourConfig.firstPhotoRotation +
        (tourConfig.photos[tourConfig.firstPhotoId].rotationOffset || 0)
      });
    }

    render(){
      //map short names to state values that will be used.
      let {zoomZ, locationId, nextLocationId, data, notes} = this.props.photo;
      let rot = this.props.photo.rotation;
      let trans = this.props.photo.translation;
      console.log("Trans:", trans, "Rot:", rot);
      //map short names to functions that will be used.
      let {updatePhoto, changeLocationId, changeNextLocationId, changeZoom} = this.props;
      if(!data){
        return null;
      }

      const photoData = (locationId && data.photos[locationId]) || null;
      const isLoading = nextLocationId !== locationId;
      //console.log("Props in render: ", this.props);

      // just made these 'vars', cuz idk if const are worth it
      const tooltips = (photoData && photoData.tooltips) || null;
      const rotation = ((photoData && photoData.rotationOffset) || 0);
      //console.log(this.props.photo.rotation);
        return (
          <View onInput={this.handleInput}
            style={{
              transform: [
              {rotateX: + trans},
              {rotateY: - ((rot == 0) ? rotation : rot)},
            ]
          }}>
            <Pano style={{
                tintColor: isLoading ? 'grey' : 'white',
              }}
              onLoad={() => {changeLocationId(nextLocationId)}}
              source={asset(data.photos[nextLocationId].uri)}
            />

            <CylindricalPanel
              layer={{width: MAX_TEXTURE_WIDTH, height: MAX_TEXTURE_HEIGHT,
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

                {/* code that dynamically adds buttons to the page */}
                {/*
                    const temp = {...tooltips[tooltips.length-1]};
                    temp.rotationY = (temp.rotationY - 10);
                    temp.linkedPhotoId += 200;
                    tooltips.push(temp)
                    // console.log(tooltips);
                */}
              {/* Main Content View */}
                <View>
                  {/* Show a spinner while first pano is loading */}
                  {locationId == null && <LoadingSpinner style={{layoutOrigin: [0.5, 0.5]}}
                      pixelsPerMeter={PPM}
                      // Undo the rotation so spinner is centered
                      translateX={degreesToPixels(rotation) * -1}
                    />}
                  {tooltips && <DisplayTooltips data={data} tooltips={tooltips} ppm={PPM}
                    changeNextLocationId={changeNextLocationId} isLoading={isLoading}
                    degreesToPixels={degreesToPixels} notes={notes}/>}
                </View>
              </View>
            </CylindricalPanel>
          </View>
        );
    }
}

//in "mapStateToProps", map names to use values returned from reducer
const mapStateToProps = state => ({
  name: state.user.name,
  VRTextBox: state.mode.VRTextBox,
  text: state.mode.text,
  StaticTextBox: state.mode.StaticTextBox,
  input: state.mode.input,
  //photo props
  photo: state.photo,
});

//in "mapDispatchToProps", map names to use functions returned from action
//"mode" and "photo" are imported at the top of this file.
const mapDispatchToProps = dispatch => ({
  // show: () => dispatch(mode.createActiveMode()),
  // hide: () => dispatch(mode.viewActiveMode()),
  // textOn: () => dispatch(mode.textInputMode()),
  // textInput: (text) => dispatch(mode.textInput(text)),
  updatePhoto: (nextPhoto) => dispatch(photo.updatePhoto(nextPhoto)),
  changeLocationId: (locationId) => dispatch(photo.changeLocationId(locationId)),
  changeNextLocationId: (locationId) => dispatch(photo.changeNextLocationId(locationId)),
  changeZoom: (zoom) => dispatch(photo.changeZoom(zoom)),
  focusNote: (obj) => dispatch(photo.focusNote(obj)),
  updateData: (data) => dispatch(photo.updateData(data)),
  updateNotes: (notes) => dispatch(photo.updateNotes(notes)),
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