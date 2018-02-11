import React from 'react';
import {
  View, 
} from 'react-vr';

// Base tour files ~
import NavButton from './NavButton';
import InfoButton from './InfoButton';
import LoadingSpinner from './LoadingSpinner';

const MAX_TEXTURE_WIDTH = 4096;
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;

export default class MainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltips:   props.tooltips   || [],
      locationId: props.locationId || null,
    };
  }

  // idk how to trigger up a state change etc
  componentDidMount() {
    this.init();
  }

  init() {
    // RE-DEFINE STATE VARIABLES FROM THE CONSTRUCTOR HERE
    this.setState({
      tooltips: this.state.tooltips || [],
      locationId: this.state.locationId || null,
    });
  }

  render() {

    console.log("inside Contents", this.state);

    return (
      <View>
        {this.state.tooltips &&
          this.state.tooltips.map((tooltip, index) => {
            // Iterate through items related to this location, creating either
            // info buttons, which show tooltip on hover, or nav buttons, which
            // change the current location in the tour.

            console.log("inside", tooltip);
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

        {this.state.locationId == null &&
        // Show a spinner while first pano is loading.
          <LoadingSpinner
            style={{layoutOrigin: [0.5, 0.5]}}
            pixelsPerMeter={PPM}
          />}
      </View>
    );
  }
}