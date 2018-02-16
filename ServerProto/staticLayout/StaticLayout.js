import React from 'react';
import {Text, View, VrButton, NativeModules} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      displayTooltips: false,
      tooltipID: 0,
      updateNotes: true,
    }
    this.editNote = this.editNote.bind(this);
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

  componentDidUpdate() {
    let {data, locationId, notes} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const temp = (tooltips && tooltips.filter(t => t.type=='textblock')) || null;
    if(temp && this.state.updateNotes){
      this.props.updateNotes(temp);
      this.setState({updateNotes : false})
    }
    if(temp && notes && temp[0] !== notes[0]){
      this.setState({updateNotes : true});
    }
    // console.log("Notes: ", notes);
    // console.log("Temp: ", temp);
  }


  editNote(){
    let {notes} = this.props.photo;
    if(notes.length> 0){
       NativeModules.DomOverlayModule.closeOverlay();
       NativeModules.DomOverlayModule.openOverlay(notes[this.state.tooltipID].text);
    }
    else{
      console.log("No Tooltips");
    }
  }

  test(){
    console.log(this.props.photo.data.photos);
  }

  updateText(text){
    let notes = this.props.photo.notes
    notes[this.state.tooltipID].text = text;
    this.props.updateNotes(notes);
  }

  toggleTooltips(){
    this.setState({displayTooltips: !this.state.displayTooltips})
  }

  selectTooltip(index){
    let {notes} = this.props.photo;
    this.setState({tooltipID: index})
    NativeModules.DomOverlayModule.closeOverlay();
    NativeModules.DomOverlayModule.openOverlay(notes[index].text);
  }

  goHome(){
    this.setState({displayTooltips: false})
    this.props.changeNextLocationId("000001");
    NativeModules.DomOverlayModule.closeOverlay();
  }

  render() {
    let {notes} = this.props.photo;
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
{/*
        <VrButton style={styles.menuButton} onClick={this.editNote}>
          <Text style={styles.menuText}>Edit Note</Text>
        </VrButton>
       <VrButton style={styles.menuButton} onClick={this.test}>
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
      {(this.state.displayTooltips && notes.length > 0) && <View style={styles.tooltipList}>
          {notes.map((tooltip, index) => {
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
