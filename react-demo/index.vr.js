/**
 * FB and Oculus Copyright and jara jara ...
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  asset,
  Image,
  Model,
  Pano,
  Text,
  Sound,
  StyleSheet,
  View,
  VrButton,
  Scene,
} from 'react-vr';

import CylindricalPanel from 'CylindricalPanel';

// Created Components
// import ZoomButton from './ZoomButton.js';
import NavButton from './NavButton';
import InfoButton from './InfoButton';
import LoadingSpinner from './LoadingSpinner';

// import MainContent from './MainContent.js';
{/*
  * Tried to make the main tooltip logic its own component...
  * but didn't find a way to trigger a state change from a children to parent compt
 **/}

// Static Tour f(x)s and variables used later ~
const MAX_TEXTURE_HEIGHT = 720;
const MAX_TEXTURE_WIDTH = 4096;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;

class TourSample extends React.Component {
  static defaultProps = {
    // This is the source for all Panoramic Data, for now
    // Eventually need to have a DB and point that data/JSON to this ~
    // data in this object can be later accessed by 'this.prop.[key_name]'

    tourSource: 'tourOfTheChester.json',
  };

  constructor(props) {
    super(props);

    // Base State Variables
    this.state = {
      rotZ: 0,
      data: null,
      rotation: null,
      locationId: null,
      nextLocationId: null,
    };

    // React's CSS-like styles
    // This is not used anywhere thou
    this.styles = StyleSheet.create({
      menu: {
        flex: 1,
        width: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        transform: [{ translate: [2, 2, -5] }],
      },
    });
  }

  // Marcial:
  //  Need to look relearn what this is again...
  //  I think it's some kind of middleware after loading/construction
  componentDidMount() {
    // Gets the json file, and later initiallizes the component

    fetch(asset(this.props.tourSource).uri)
      .then(response => response.json())
      .then(responseData => {
        this.init(responseData);
      })
      .done();
  }

  // Initialize the tour based on data file.
  init(tourConfig) {
    // RE-DEFINE STATE VARIABLES FROM THE CONSTRUCTOR HERE
    this.setState({
      rotZ: 0,
      data: tourConfig,
      locationId: null,
      nextLocationId: tourConfig.firstPhotoId,
      rotation: tourConfig.firstPhotoRotation +
        (tourConfig.photos[tourConfig.firstPhotoId].rotationOffset || 0),
    });
  }

  render() {
    console.log(this.props);
    console.log(this.state);

    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (this.state.locationId && this.state.data.photos[locationId]) || null;
    const isLoading = this.state.nextLocationId !== this.state.locationId;

    // just made these 'vars', cuz idk if const are worth it
    var tooltips = (photoData && photoData.tooltips) || null;
    var rotation = ((photoData && photoData.rotationOffset) || 0);

    return (
      <View
        style={{
          // this ATTEMPTS to resets each picture's initial rotation
          // no idea how to extract ACTUAL xyz coors/rotations
          transform: [
            {rotateY : -rotation},
          ],
        }}
      >

        <Pano
          // This does not contribute to the layout of other views
          // (it uses absolute position by default),
          style={{
            tintColor: isLoading ? 'grey' : 'white',

            // this WORKS!!!
            transform: [
              {translate: [0, 0, this.state.rotZ]},
            ],
          }}

          onLoad={() => {
            const data = this.state.data;

            this.setState({
              // Now that ths new photo is loaded, update the locationId.
              locationId: this.state.nextLocationId,
            });
          }}

          source={asset(this.state.data.photos[this.state.nextLocationId].uri)}
        />

        <CylindricalPanel
          layer={{
            width: MAX_TEXTURE_WIDTH,
            height: MAX_TEXTURE_HEIGHT,
            density: MAX_TEXTURE_WIDTH,
          }}
          style={{
            position: 'absolute'
          }}
          >

          <View
            style={{
              // Centered so contents appear in middle of cylinder
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

            {/* this button bring the picture forward (increases base z axis) */}
            <NavButton
              onInput={() => {
                this.setState({
                  rotZ: this.state.rotZ + 10,
                });
              }}

              source={asset(this.state.data.nav_icon)}
              textLabel={"Zoom"}
              // This prop seems to be required, check the NavButton file for more
              pixelsPerMeter={PPM}
            />

          {/* Main Content View */}
            <View>
              {/* Show a spinner while first pano is loading */}
              {this.state.locationId == null &&
                <LoadingSpinner
                  style={{layoutOrigin: [0.5, 0.5]}}
                  pixelsPerMeter={PPM}

                  // Undo the rotation so spinner is centered
                  translateX={degreesToPixels(rotation) * -1}
                />}

              {tooltips &&
                tooltips.map((tooltip, index) => {
                  // Iterate through items related to this location, creating either:
                  // - Nav buttons: change Pano source and tooltips associated it with them
                  // - Info buttons: show tooltip on hover
                  // P.S: idk what's the use of the key props ~

                  if (tooltip.type) {
                    return (
                      <InfoButton
                        // key={index}
                        source={asset('info_icon.png')}
                        tooltip={tooltip}
                        pixelsPerMeter={PPM}
                        translateX={degreesToPixels(tooltip.rotationY)}
                        translateY={degreesToPixels(tooltip.translateX)}
                      />
                    );
                  }

                  return (
                    <NavButton
                      // key={tooltip.linkedPhotoId}
                      isLoading={isLoading}
                      onInput={() => {
                        this.setState({
                          nextLocationId: tooltip.linkedPhotoId,
                        });
                        // Update nextLocationId, not locationId, so tooltips match
                        // the currently visible pano; pano will update locationId
                        // after loading the new image.
                      }}
                      source={asset(this.state.data.nav_icon)}
                      textLabel={tooltip.text}
                      pixelsPerMeter={PPM}
                      translateX={degreesToPixels(tooltip.rotationY)}
                    />
                  );
                })}
            </View>

          </View>
        </CylindricalPanel>
      </View>
    );
  }
}

// Name used to create module, via reactNativeContext.createRootView('TourSample')
AppRegistry.registerComponent('TourSample', () => TourSample);
module.exports = TourSample;
