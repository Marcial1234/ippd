import React from 'react';
import {Text, View, VrButton, NativeModules, Image, asset} from 'react-vr';
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
      overlayOpen: false,
      adjustRate: 6,
    }
    this.editNote = this.editNote.bind(this);
    this.moveNote = this.moveNote.bind(this);
    this.test = this.test.bind(this);
    this.updateText = this.updateText.bind(this);
    this.goHome = this.goHome.bind(this);
    this.toggleTooltips = this.toggleTooltips.bind(this);
    this.selectTooltip = this.selectTooltip.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.refreshTooltips = this.refreshTooltips.bind(this);
    this.adjustRate = this.adjustRate.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.buildingSelection = this.buildingSelection.bind(this);
    this.openOverlay = this.openOverlay.bind(this);

  }

  componentWillMount(){
    //will respond to the call for 'updateText', obj is the value recieved
    RCTDeviceEventEmitter.addListener('updateText', obj => {
      this.updateText(obj);
    });
    RCTDeviceEventEmitter.addListener('overlayClose', () => {
      this.setState({overlayOpen: false,})
    });
    RCTDeviceEventEmitter.addListener('overlayOpen', () => {
      this.setState({overlayOpen: true,})
    });
    RCTDeviceEventEmitter.addListener('selectBuilding', obj => {
      this.props.selectBuilding(obj);
    });
    RCTDeviceEventEmitter.addListener('selectFloor', obj => {
      this.props.selectFloor(obj);
    });
    RCTDeviceEventEmitter.addListener('selectRoom', obj => {
      this.props.selectRoom(obj);
    });
    RCTDeviceEventEmitter.addListener('selectAll', obj => {
      let {currentBuilding, currentFloor} = this.props.location;
      let {locationId} = this.props.photo;
      if(obj.building == currentBuilding && obj.floor == currentFloor && obj.room == locationId){
        console.log("Already here.");
      }
      else{
        this.props.selectAll(obj);
        let roomData = this.props.location.buildings[currentBuilding].floors[currentFloor];
        this.props.updatePhoto({
          zoomZ: 0,
          data: roomData,
          locationId: null,
          nextLocationId: obj.room,
          rotation: roomData.firstPhotoRotation +
          (roomData.photos[roomData.firstPhotoId].rotationOffset || 0)
        });
        setTimeout(function() {this.props.changeNextLocationId("000001")}.bind(this), 25);
        setTimeout(function() {this.props.changeNextLocationId("000002")}.bind(this), 25);
        setTimeout(function() {this.props.changeNextLocationId(obj.room)}.bind(this), 25);
      }
      //setTimeout(function() {this.buildingSelection()}.bind(this), 25);

    });
  }

  componentDidUpdate() {
    let {data, locationId, notes} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const temp = (tooltips && tooltips.filter(t => t.type=='textblock')) || null;
    if(temp && this.state.updateNotes){
      this.props.updateNotes(temp);
      this.setState({updateNotes : false});
    }
    if((temp && notes && temp[0] !== notes[0]) || (!notes && temp)){
      //console.log("Notes gets temp");
      this.setState({updateNotes : true});
    }
    // console.log("Notes: ", notes);
    // console.log("Temp: ", temp);
  }

  createNote(){
    let {notes, data, locationId} = this.props.photo;
    let newNote = {
      type: "textblock",
      title: "New Note",
      text: "It's Full!",
      attribution: "Yes Ma'am",
      rotationY: notes.length>0 ? notes[this.state.tooltipID].rotationY - 20 : 160,
      translateX: 0,
      width: 1.3,
      height: 1.5,
      selected: false,
    }

    // newNote.rotationY = (newNote.rotationY -10);
    // console.log(notes);
    // console.log("New Note: ", newNote);
    notes.push(newNote);
    data.photos[locationId].tooltips.push(newNote);
    this.props.updateData(data);
    if(this.state.displayTooltips){
      this.refreshTooltips();
    }
    else{
      this.toggleTooltips();
    }
    this.selectTooltip(notes.length-1);
    //console.log(notes[notes.length-1]);
  }

  moveNote(direction){
    let notes = this.props.photo.notes;
    let adj = this.state.adjustRate;
    //need to figure out what to do at 180 degrees

    switch(direction){
      case "right":
      if(notes[this.state.tooltipID].rotationY - adj > -180){
        notes[this.state.tooltipID].rotationY -=adj;
      }
      else{
        notes[this.state.tooltipID].rotationY *=-1;
      }
      break;
      case "left":
      if(notes[this.state.tooltipID].rotationY + adj < 180){
        notes[this.state.tooltipID].rotationY +=adj;
      }
      else{
        notes[this.state.tooltipID].rotationY *=-1;
      }
      break;
      case "up":
      notes[this.state.tooltipID].translateX -=adj;
      break;
      case "down":
      notes[this.state.tooltipID].translateX +=adj;
      break;
    }
    // console.log("Current Rotation:", notes[this.state.tooltipID].rotationY);
    // console.log("Current Translation:", notes[this.state.tooltipID].translateX);
    this.props.updateNotes(notes);
  }

  editNote(index){
    let {notes} = this.props.photo;
    this.selectTooltip(index);
    if(notes.length> 0){
       this.openOverlay(index, "Text");
    }
    else{
      console.log("No Tooltips");
    }
  }


  deleteNote(index){
      let {notes, data, locationId} = this.props.photo;
      if(index == this.state.tooltipID){
        NativeModules.DomOverlayModule.closeOverlay();
      }
      let i = notes[index];
      let d = data.photos[locationId].tooltips.indexOf(i);
      notes.splice(index, 1);
      data.photos[locationId].tooltips.splice(d, 1);
      this.props.updateData(data);
      this.refreshTooltips();

    }

  updateText(obj){
    let notes = this.props.photo.notes
    notes[this.state.tooltipID].text = obj.text;
    notes[this.state.tooltipID].title = obj.title;
    this.props.updateNotes(notes);
    this.refreshTooltips();
  }

  toggleTooltips(){
    this.setState({
        displayTooltips: !this.state.displayTooltips,
      })
  }

  selectTooltip(index){
    let {notes, data, locationId} = this.props.photo;
    this.setState({tooltipID: index});
    if(this.state.overlayOpen){
       this.openOverlay(index, "Text");
    }
    for(let i = 0; i < notes.length; i++){
      if(i == index){
        notes[i].selected = true;
      }
      else{
        notes[i].selected = false;
      }
    }
    this.props.updateNotes(notes);
    //this.props.updateData(data);
    // console.log("Notes: ", notes);
    // console.log("Data: ", data);
    let obj = {
      rotation: notes[index].rotationY,
      translation: notes[index].translateX
    }
    this.props.focusNote(obj);
  }

  adjustRate(direction){
    switch (direction){
      case "up":
        if(this.state.adjustRate < 20){
          this.setState({adjustRate : this.state.adjustRate + 2 })
        }
        else{
            console.log("Adjust Rate Maxed");
        }
        break;
      case "down":
        if(this.state.adjustRate > 2){
          this.setState({adjustRate : this.state.adjustRate - 2 })
        }
        else{
            console.log("Adjust Rate Minimized");
        }
      break;

    }
  }
  changeRate(magnitude){
    this.setState({adjustRate : magnitude })
  }

  buildingSelection(){
    this.openOverlay(-1, "Select");
  }

  refreshTooltips(){
    setTimeout(function() {this.toggleTooltips()}.bind(this), 25);
    setTimeout(function() {this.toggleTooltips()}.bind(this), 25);
  }

  openOverlay(index, type){
    let {notes, locationId} = this.props.photo;
    let {currentFloor, currentBuilding, buildings} = this.props.location;
    console.log(currentFloor, currentBuilding);
    // let BU = Object.assign({}, buildings);
    //let BU = {...buildings};
  //  let BU = {};
    // for(var k in buildings){
    //   BU[k] = buildings[k];
    // }
    let BU = JSON.parse(JSON.stringify(buildings));
    // console.log(BU);

    NativeModules.DomOverlayModule.closeOverlay();
    if(type == "Text"){
      NativeModules.DomOverlayModule.openOverlay(
         type, notes[index].text, notes[index].title, locationId, currentFloor, currentBuilding, BU
       )
    }
    if(type == "Select"){
      NativeModules.DomOverlayModule.openOverlay(
         type, "", "", locationId, currentFloor, currentBuilding, BU
       )
    }

  }

  goHome(){
    this.setState({displayTooltips: false})
    this.props.changeNextLocationId("000001");
    NativeModules.DomOverlayModule.closeOverlay();
  }

  test(){
    console.log("Photo:", this.props.photo);
    console.log("Notes: ", this.props.photo.notes);
    console.log("Data: ", this.props.photo.data);
    console.log("LocationID: ", this.props.photo.locationId);
  }

  render() {
    let {notes} = this.props.photo;
    var lvls = [];
    for (let i = 2; i <= 20; i+=2){
      lvls.push(i);
    }

    if(!notes){
      notes = [];
    }

    return (
      <View >
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
        <VrButton style={styles.menuButton} onClick={this.test}>
             <Text style={styles.menuText}>Log It</Text>
       </VrButton>
{/*
        <VrButton style={styles.menuButton} onClick={this.editNote}>
          <Text style={styles.menuText}>Edit Note</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.changeVal}>
          <Text style={styles.menuText}>Change Val</Text>
        </VrButton>
*/}
        <VrButton style={styles.menuButton} onClick={this.createNote}>
          <Text style={styles.menuText}>Create Note</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.buildingSelection}>
          <Text style={styles.menuText}>Building Selection: {this.props.location.currentBuilding}</Text>
        </VrButton>

        <VrButton style={styles.menuButton} onClick={this.toggleTooltips}>
          <Text style={styles.menuText}>Toggle Tooltips</Text>
        </VrButton>
      </View>
      {(this.state.displayTooltips && notes.length > 0) && <View style={styles.tooltipList}>
          {notes.map((tooltip, index) => {
          return(
            <View style={styles.tooltipListRow} key={index}>
              <VrButton onClick={() => this.selectTooltip(index)}>
                <Text style={(index==(this.state.tooltipID)) ? styles.tooltipListItemSelected : styles.tooltipListItem}>
                {tooltip.title}
                </Text>
              </VrButton>
              <VrButton onClick={() => this.editNote(index) }>
                <Image style={styles.tooltipListImage} source={asset('edit_icon.png')}></Image>
              </VrButton>
              <VrButton onClick={() => this.deleteNote(index)}>
                <Image style={styles.tooltipListImage} source={asset('deleteX.png')}></Image>
              </VrButton>
            </View>);
        })}
      </View>}
      {(this.state.displayTooltips && notes.length > 0) && <View style={styles.pBButton}>
      <VrButton style={styles.pBLeft} onClick={() => this.moveNote("left")}>
        <Text style={styles.menuText}>Left</Text>
      </VrButton>
      <VrButton style={styles.pBRight} onClick={() => this.moveNote("right")}>
        <Text style={styles.menuText}>Right</Text>
      </VrButton>
      <VrButton style={styles.pBUp} onClick={() => this.moveNote("up")}>
        <Text style={styles.menuText}>Up</Text>
      </VrButton>
      <VrButton style={styles.pBDown} onClick={() => this.moveNote("down")}>
        <Text style={styles.menuText}>Down</Text>
      </VrButton>
      <VrButton style={styles.pBPlus} onClick={() => this.adjustRate("up")}>
        <Text style={styles.menuText}>+</Text>
      </VrButton>
      <VrButton style={styles.pBRate}>
        <Text style={styles.menuText}>{this.state.adjustRate}</Text>
      </VrButton>
      <VrButton style={styles.pBMinus} onClick={() => this.adjustRate("down")}>
        <Text style={styles.menuText}>-</Text>
      </VrButton>
      <View style={styles.pBRateBar}>
        {lvls.map((mag, index) => {
          return(
            <VrButton style={(this.state.adjustRate == mag) ? styles.pBRateBarButtonSelected : styles.pBRateBarButton}
                key ={index} onClick={() => this.changeRate(mag)}>
                  <Text style={styles.barText}>{mag}</Text>
            </VrButton>
          );
        })}
      </View>
      </View>}
      </View>
    );
  }
}
