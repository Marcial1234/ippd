/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Example ReactVR app that allows a simple tour using linked 360 photos.
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
  Scene
} from 'react-vr';

import NavButton from './NavButton';
import InfoButton from './InfoButton';
// import ZoomButton from './ZoomButton.js';
import LoadingSpinner from './LoadingSpinner';
import CylindricalPanel from 'CylindricalPanel';

// Web VR is only able to support a maxiumum texture resolution of 4096 px
const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
// Cylinder is a 2D surface a fixed distance from the camera.
// It uses pixes instead of meters for positioning components.
// pixels = degrees/360 * density, negative to rotate in expected direction.
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
// PPM = 1/(2*PI*Radius) * density. Radius of cylinder is 3 meters.
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends React.Component {
  static defaultProps = {
    tourSource: 'tourOfTheChester.json',
  };

  constructor(props) {
    super(props);
    this.state = {
      rotZ: 0,
      data: null,
      locationId: null,
      nextLocationId: null,
      rotation: null,
    };

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

  componentDidMount() {
    fetch(asset(this.props.tourSource).uri)
      .then(response => response.json())
      .then(responseData => {
        this.init(responseData);
      })
      .done();
  }

  init(tourConfig) {
    // Initialize the tour based on data file.
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
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (locationId && this.state.data.photos[locationId]) || null;
    const isLoading = this.state.nextLocationId !== this.state.locationId;

    var tooltips = (photoData && photoData.tooltips) || null;
    var rotation = ((photoData && photoData.rotationOffset) || 0);

    // const soundEffects = this.state.data.soundEffects;
    // const ambient = this.state.data.soundEffects.ambient;

    return (
      <View
        style={{
          // THIS ATTEMPTS TO resets each picture's initial rotation
          // no idea how to extract ACTUAL xyz coors
          transform: [
            // {translate: [0, 0, this.state.rotZ]},
            {rotateY : -rotation}, 
            // {scale : this.state.rotZ + 1 },
          ],
        }}
      >

        {/*
          {ambient &&
            <Sound
              // Background audio that plays throughout the tour.
              source={asset(ambient.uri)}
              autoPlay={true}
              loop={ambient.loop}
              volume={ambient.volume}
            />}
        */}

        <Pano
          // Place pano in world, and by using position absolute it does not
          // contribute to the layout of other views.
          style={{
            // this WORKS!!!
            transform: [
              {translate: [0, 0, this.state.rotZ]},
            ],
            tintColor: isLoading ? 'grey' : 'white',
          }}
          onLoad={() => {
            const data = this.state.data;

            // console.log(locationId, -rotation, data);
            // console.log(this);

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
              // View covering the cyldiner. Center so contents appear in middle of cylinder.
              alignItems: 'center',
              justifyContent: 'center',
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT,
            }}>
            {/* Need container view, else using absolute position on buttons removes them from cylinder */}


            {/*Zoom Button*/}
            {/*
              style={{
                position: 'absolute',
                transform: [
                  {translate: [30, 30, 5]},
                ],
              }}
            */}

            {/* this button changes the z axis (bring the items forward) */}
            <NavButton

              // onClickSound={asset(soundEffects.navButton.onClick.uri)}
              // onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
              onInput={() => {

                const temp = {...tooltips[tooltips.length-1]};
                temp.rotationY = (temp.rotationY - 10);
                temp.linkedPhotoId += 200;
                tooltips.push(temp)

                console.log(tooltips);

                this.setState({
                  rotZ: this.state.rotZ + 10,
                });
              }}
              source={asset(this.state.data.nav_icon)}
              textLabel={"Zoom"}
              pixelsPerMeter={PPM}
            />

            <View>
              {tooltips &&
                tooltips.map((tooltip, index) => {
                  // Iterate through items related to this location, creating either
                  // info buttons, which show tooltip on hover, or nav buttons, which
                  // change the current location in the tour.

                  if (tooltip.type) {
                    return (
                      <InfoButton
                        // key={index}
                        // onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
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
                      // onClickSound={asset(soundEffects.navButton.onClick.uri)}
                      // onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                      onInput={() => {
                        // Update nextLocationId, not locationId, so tooltips match
                        // the currently visible pano; pano will update locationId
                        // after loading the new image.
                        this.setState({
                          nextLocationId: tooltip.linkedPhotoId,
                        });
                      }}
                      source={asset(this.state.data.nav_icon)}
                      textLabel={tooltip.text}
                      pixelsPerMeter={PPM}
                      translateX={degreesToPixels(tooltip.rotationY)}
                    />
                  );
                })}

              {locationId == null &&
                // Show a spinner while first pano is loading.
                <LoadingSpinner
                  style={{layoutOrigin: [0.5, 0.5]}}
                  pixelsPerMeter={PPM}
                  // Undo the rotation so spinner is centered
                  translateX={degreesToPixels(rotation) * -1}
                />}
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
