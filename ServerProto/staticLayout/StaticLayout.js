import React from 'react';
import {Text, View, VrButton, NativeModules} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      tooltips: false,
      tooltipID: 0,
    }
    this.openOverlay = this.openOverlay.bind(this);
    this.test = this.test.bind(this);
    this.updateText = this.updateText.bind(this);
    this.goHome = this.goHome.bind(this);
    this.toggleTooltips = this.toggleTooltips.bind(this);
    this.selectTooltip = this.selectTooltip.bind(this);

  }

  componentWillMount(){
    //will respond to the call for 'textUpdated', e is the value recieved
    RCTDeviceEventEmitter.addListener('updateText', text => {
    this.updateText(text);
    });
  }

  openOverlay(){
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    const tips = (photoData && photoData.tooltips) || null;
    const tooltips = (tips && tips.filter(t => t.type=='textblock')) || null;
    if(tooltips.length>0){
       NativeModules.DomOverlayModule.openOverlay(tooltips[this.state.tooltipID].text, tooltips[this.state.tooltipID].title);
    }
    else{
      NativeModules.DomOverlayModule.openBlankOverlay();
    }
  }

  test(){
    //console.log(this.data.photos[this.props.photo.locationId].tooltips[0].text);
    console.log(this.props.photo.data.photos);
  }

  updateText(text){
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    const tips = (photoData && photoData.tooltips) || null;
    const tooltips = (tips && tips.filter(t => t.type=='textblock')) || null;
    data.photos[this.props.photo.locationId].tooltips[tooltips.length + this.state.tooltipID].text = text;
    //console.log(data.photos[this.props.photo.locationId].tooltips[0].text);
    this.props.updateData(data);
  }

  toggleTooltips(){
    this.setState({tooltips: !this.state.tooltips})
  }

  selectTooltip(index){
    console.log(index);
    this.setState({tooltipID: index})
  }

  goHome(){
    this.props.changeNextLocationId("000001");
  }

  render() {
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    const tips = (photoData && photoData.tooltips) || null;
    const tooltips = (tips && tips.filter(t => t.type=='textblock')) || null;
    //console.log(tooltips);

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
        <VrButton style={styles.menuButton} onClick={this.openOverlay}>
          <Text style={styles.menuText}>Open Overlay</Text>
        </VrButton>
{/*        <VrButton style={styles.menuButton} onClick={this.test}>
          <Text style={styles.menuText}>Log It</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.changeVal}>
          <Text style={styles.menuText}>Change Val</Text>
        </VrButton>
*/}
        <VrButton style={styles.menuButton} onClick={this.toggleTooltips}>
          <Text style={styles.menuText}>Toggle Tooltips</Text>
        </VrButton>
      </View>
      {this.state.tooltips && <View style={styles.tooltipList}>
          {tooltips.map((tooltip, index) => {
          return(
            <VrButton key={index} onClick={() => this.selectTooltip(index)}>
              <Text style={(index==(this.state.tooltipID)) ? styles.tooltipListItemSelected : styles.tooltipListItem}>
              {tooltip.title}
              </Text>
            </VrButton>);
        })}
      </View>}
      </View>
    );
  }
}
