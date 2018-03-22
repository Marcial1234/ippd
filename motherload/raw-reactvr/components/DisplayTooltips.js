import React from 'react';
import {Text, View, VrButton, NativeModules, asset} from 'react-vr';

// bug...
// not being used... ?
import styles from '../static_assets/styles'
// if you're gonna use it, you're gonna have fun moving around more files... just hardcode it

import NavButton from './NavButton';
import InfoButton from './InfoButton';
import LoadingSpinner from './LoadingSpinner';

export default class DisplayTooltips extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    let {data, tooltips, ppm, changeNextLocationId, isLoading, degreesToPixels, notes} = this.props;
    return(
      <View>
        <View>
          {tooltips.map((tooltip, index) => {
            // Iterate through items related to this location, creating either:
            // - Nav buttons: change Pano source and tooltips associated it with them
            // - Info buttons: show tooltip on hover
            // P.S: idk what's the use of the key props ~

            if (!tooltip.type) {
              return (
                <NavButton
                  key={tooltip.linkedPhotoId}
                  isLoading={isLoading}
                  onInput={() => {
                    changeNextLocationId(tooltip.linkedPhotoId)
                    // Update nextLocationId, not locationId, so tooltips match
                    // the currently visible pano; pano will update locationId
                    // after loading the new image.
                  }}
                  source={asset('UpArrowNav.png')}
                  textLabel={tooltip.text}
                  pixelsPerMeter={ppm}
                  translateX={degreesToPixels(tooltip.rotationY)}
                />
              );
            }
          })}
        </View>
        <View>
          {notes && notes.map((tooltip, index) => {
              return (
                <InfoButton
                  key={index}
                  source={ tooltip.selected ? asset('info_icon_selected.png') : asset('info_icon.png')}
                  tooltip={tooltip}
                  pixelsPerMeter={ppm}
                  translateX={degreesToPixels(tooltip.rotationY)}
                  translateY={degreesToPixels(tooltip.translateX)}
                />
              );
            })}
        </View>
      </View>
    )
  }
}
