import React from 'react';
import {Text, View, VrButton, NativeModules, Image, asset} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      tooltipID: 0,
      adjustRate: 6,
      updateNotes: true,
      overlayOpen1: false,
      overlayOpen2: false,
      displayTooltips: false,
      cameraRot: null,
    }

    this.test = this.test.bind(this);
    this.goHome = this.goHome.bind(this);
    this.editNote = this.editNote.bind(this);
    this.moveNote = this.moveNote.bind(this);
    this.updateText = this.updateText.bind(this);
    this.updateGNotes = this.updateGNotes.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.adjustRate = this.adjustRate.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.openOverlay = this.openOverlay.bind(this);
    this.selectTooltip = this.selectTooltip.bind(this);
    this.toggleNotes = this.toggleNotes.bind(this);
    this.refreshTooltips = this.refreshTooltips.bind(this);
    this.buildingSelection = this.buildingSelection.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  componentWillMount(){
    //will respond to the call for 'updateText', obj is the value recieved
    RCTDeviceEventEmitter.addListener('updateText', obj => {
      this.updateText(obj);
    });
    RCTDeviceEventEmitter.addListener('updateGNotes', obj => {
      this.updateGNotes(obj);
    });
    RCTDeviceEventEmitter.addListener('overlayClose1', () => {
      this.setState({overlayOpen1: false,})
    });
    RCTDeviceEventEmitter.addListener('overlayClose2', () => {
      this.setState({overlayOpen2: false,})
    });
    RCTDeviceEventEmitter.addListener('overlayOpen1', () => {
      this.setState({overlayOpen1: true,})
    });
    RCTDeviceEventEmitter.addListener('overlayOpen2', () => {
      this.setState({overlayOpen2: true,})
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
      this.selectAll(obj);
    });
    RCTDeviceEventEmitter.addListener('cameraRot', obj => {
      this.setState({cameraRot: obj});
    });

  }

  componentDidMount(){
    setTimeout(function() {this.openOverlay(-1, "Select")}.bind(this), 500);
  }

  componentDidUpdate(prevProps){
    if(prevProps.photo.locationId !== this.props.photo.locationId){
          NativeModules.DomOverlayModule.closeOverlay2();
          this.openOverlay(-1, "Select");
          if(this.state.overlayOpen1){
            NativeModules.DomOverlayModule.closeOverlay1();
            this.openOverlay(-1, "General");
          }
          if(this.state.displayTooltips){
            this.refreshTooltips();
          }

    }

  }

  createNote(){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    let ID = this.state.tooltipID;
    if(ID >= notes.length){
      this.setState({tooltipID: 0});
      ID = 0;
    }
    let newNote = {
      type: "textblock",
      title: "New Note",
      text: "It's Full!",
      attribution: "Yes Ma'am",
      rotationY: notes.length>0 ? notes[ID].rotationY - 20 : 160,
      translateX: 0,
      width: 1.3,
      height: 1.5,
      selected: false,
    }

    data.photos[locationId].notes.push(newNote);
    this.props.updateData(data);
    if(this.state.displayTooltips){
      this.refreshTooltips();
    }
    else{
      this.toggleNotes();
    }
    this.selectTooltip(notes.length -1);
  }

  moveNote(direction){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    let adj = this.state.adjustRate;
    let ID = this.state.tooltipID;
    if(ID >= notes.length){
      this.setState({tooltipID: 0});
      ID = 0;
    }
    //need to figure out what to do at 180 degrees

    switch(direction){
      case "right":
      if(notes[ID].rotationY - adj > -180){
        notes[ID].rotationY -=adj;
      }
      else{
        notes[ID].rotationY *=-1;
      }
      break;
      case "left":
      if(notes[ID].rotationY + adj < 180){
        notes[ID].rotationY +=adj;
      }
      else{
        notes[ID].rotationY *=-1;
      }
      break;
      case "up":
      notes[ID].translateX -=adj;
      break;
      case "down":
      notes[ID].translateX +=adj;
      break;
    }
    data.photos[locationId].notes = notes;
    this.props.updateData(data);
    // this.props.updateNotes(notes);
  }

  editNote(index){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    this.selectTooltip(index);
    if(notes.length> 0){
       this.openOverlay(index, "Text");
    }
    else{
      console.log("No Tooltips");
    }
  }


  deleteNote(index){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
      if(index == this.state.tooltipID){
        NativeModules.DomOverlayModule.closeOverlay1();
        this.openOverlay(-1, "General");
      }
      data.photos[locationId].notes.splice(index, 1);
      this.props.updateData(data);
      this.refreshTooltips();

    }

  updateText(obj){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    notes[this.state.tooltipID].text = obj.text;
    notes[this.state.tooltipID].title = obj.title;
    data.photos[locationId].notes = notes;
    this.props.updateData(data);
    this.refreshTooltips();
  }

  updateGNotes(obj){
    let {data, locationId} = this.props.photo;
    data.photos[locationId].gNotes = obj;
    this.props.updateData(data);
  }

  toggleNotes(){
    this.setState({
      displayTooltips: !this.state.displayTooltips,
    })
  }

  selectTooltip(index){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    this.setState({tooltipID: index});
    if(this.state.overlayOpen1){
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
    data.photos[locationId].notes = notes;
    this.props.updateData(data);
    NativeModules.DomOverlayModule.cameraRot();

    setTimeout(function() {
      let rot = (this.state.cameraRot._y*57)%360;
      let trans = (this.state.cameraRot._x*57)%360;
      let obj = {
        rotation: notes[index].rotationY - rot,
        translation: 0, //notes[index].translateX
      };
      this.props.focusNote(obj);
    }.bind(this), 25);

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
    if(this.state.overlayOpen2){
      NativeModules.DomOverlayModule.closeOverlay2();
    }
    else{
      this.openOverlay(-1, "Select");
    }

  }

  refreshTooltips(){
    setTimeout(function() {this.toggleNotes()}.bind(this), 25);
    setTimeout(function() {this.toggleNotes()}.bind(this), 25);
  }

  openOverlay(index, type){
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    let notes = (photoData && photoData.notes) || null;
    let gNotes = (photoData && photoData.gNotes) || null;
    let {currentFloor, currentBuilding, buildings} = this.props.location;
    let BU = JSON.parse(JSON.stringify(buildings));
    if(type == "Text"){
      NativeModules.DomOverlayModule.closeOverlay1();
      NativeModules.DomOverlayModule.openOverlay1(notes[index].text, notes[index].title, "Both", gNotes);
    }
    if (type == "General"){
      NativeModules.DomOverlayModule.closeOverlay1();
      NativeModules.DomOverlayModule.openOverlay1("", "", "General", gNotes);
    }
    if(type == "Select"){
      NativeModules.DomOverlayModule.closeOverlay2();
      NativeModules.DomOverlayModule.openOverlay2(locationId, currentFloor, currentBuilding, BU);
    }
  }

  selectAll(obj){
    let {currentBuilding, currentFloor} = this.props.location;
    let {locationId, data} = this.props.photo;
    if(obj.building == currentBuilding && obj.floor == currentFloor && obj.room == locationId){
      console.log("Already here.");
    }
    else{
      this.props.selectAll(obj);
      let roomData = this.props.location.buildings[obj.building].floors[obj.floor];
      // let bLocs = Object.keys(this.props.location.buildings);
      // building = bLocs[0];
      // let fLocs = Object.keys(this.props.location.buildings[bLocs[0]].floors);
      // floor = fLocs[0];
      // roomData = this.props.location.buildings[bLocs[0]].floors[fLocs[0]];
      let rdp = Object.keys(roomData.photos);
      if(!rdp.includes(obj.room)){
        obj.room = rdp[0];
      }
      this.props.updatePhoto({
        zoomZ: 0,
        data: roomData,
        locationId: null,
        nextLocationId: obj.room,
        rotation: roomData.firstPhotoRotation +
        (roomData.photos[roomData.firstPhotoId].rotationOffset || 0)
      });
      let locs = Object.keys(roomData.photos);
      // console.log();
      setTimeout(function() {this.props.changeNextLocationId(locs[0])}.bind(this), 25);
      setTimeout(function() {this.props.changeNextLocationId(locs[1])}.bind(this), 25);
      setTimeout(function() {this.props.changeNextLocationId(obj.room)}.bind(this), 25);
    }
  }

  goHome(){
    let {data} = this.props.photo;
    let bLocs = Object.keys(this.props.location.buildings);
    building = bLocs[0];
    let fLocs = Object.keys(this.props.location.buildings[bLocs[0]].floors);
    floor = fLocs[0];
    let rLocs = Object.keys(this.props.location.buildings[bLocs[0]].floors[fLocs[0]].photos);
    room = rLocs[0];
    this.selectAll({building, floor, room});
    //this.props.changeNextLocationId(locs[0]);
    this.setState({displayTooltips: false})
    NativeModules.DomOverlayModule.closeOverlay1();
    NativeModules.DomOverlayModule.cameraRot();
    setTimeout(function() {
      let rot = (this.state.cameraRot._y*57)%360;
      let obj = {
        rotation: -rot,
        translation: 0,
      };
      this.props.focusNote(obj);
    }.bind(this), 25);
    // NativeModules.DomOverlayModule.closeOverlay2();
  }

  test(){

  }

  render() {
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    let notes = (photoData && photoData.notes) || null;
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
        <VrButton style={styles.menuButton} onClick={ () => this.openOverlay(-1, "General")}>
               <Text style={styles.menuText}>Room Notes</Text>
        </VrButton>
{/*
        <VrButton style={styles.menuButton} onClick={this.test}>
               <Text style={styles.menuText}>Log It</Text>
        </VrButton>
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

        <VrButton style={styles.menuButton} onClick={this.toggleNotes}>
          <Text style={styles.menuText}>Toggle Notes</Text>
        </VrButton>
      </View>
      {!this.state.overlayOpen2 &&
      <VrButton style={styles.selection} onClick={this.buildingSelection}>
        <Image style={styles.selectionImage} source={asset('expand_arrow.png')}></Image>
      </VrButton>
      }
      {(this.state.displayTooltips && notes.length == 0) && <View style={styles.tooltipList}>
      <VrButton>
        <Text style={styles.tooltipListItem}>
        No Notes For This Room
        </Text>
      </VrButton>
      </View>
    }
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
