import React from 'react';
import {Text, View, VrButton, NativeModules, asset} from 'react-vr';
import NavButton from './NavButton';
import InfoButton from './InfoButton';
import LoadingSpinner from './LoadingSpinner';
import styles from './static_assets/styles'

export default class DisplayTooltips extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    let {data, tooltips, ppm, changeNextLocationId, isLoading, degreesToPixels} = this.props;
    //console.log(data);
    return(
      <View>
        {tooltips.map((tooltip, index) => {
          // Iterate through items related to this location, creating either:
          // - Nav buttons: change Pano source and tooltips associated it with them
          // - Info buttons: show tooltip on hover
          // P.S: idk what's the use of the key props ~

          if (tooltip.type) {
            return (
              <InfoButton
                key={index}
                source={asset('info_icon.png')}
                tooltip={tooltip}
                pixelsPerMeter={ppm}
                translateX={degreesToPixels(tooltip.rotationY)}
                translateY={degreesToPixels(tooltip.translateX)}
              />
            );
          }

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
              source={asset(data.nav_icon)}
              textLabel={tooltip.text}
              pixelsPerMeter={ppm}
              translateX={degreesToPixels(tooltip.rotationY)}
            />
          );
        })}
      </View>
    )
  }
}
