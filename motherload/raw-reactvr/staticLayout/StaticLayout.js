import React from 'react';
import {Text, View, VrButton, NativeModules, Image, asset} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      noteID: 0,
      navID: 0,
      adjustRate: 6,
      overlayOpen1: false,
      overlayOpen2: false,
      displayNotes: false,
      displayNavs: false,
      cameraRot: null,
      noteOrNav: "note",
    }

    this.test = this.test.bind(this);
    this.save = this.save.bind(this);
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
    this.toggleNavs = this.toggleNavs.bind(this);
    this.refreshTooltips = this.refreshTooltips.bind(this);
    this.floorSelection = this.floorSelection.bind(this);
    this.selectFloorRoom = this.selectFloorRoom.bind(this);
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
    RCTDeviceEventEmitter.addListener('selectFloorRoom', obj => {
      this.selectFloorRoom(obj);
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
          if(this.state.displayNotes){
            this.refreshTooltips();
          }

    }

  }

  createNote(){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    let ID = this.state.noteID;
    if(ID >= notes.length){
      this.setState({noteID: 0});
      ID = 0;
    }
    NativeModules.ClientModule.getRotation();
    setTimeout(function() {
      let rot = (this.state.cameraRot._y*57)%360;
    }.bind(this), 25);

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
    if(this.state.displayNotes){
      this.refreshTooltips();
    }
    else{
      this.toggleNotes();
    }
    this.selectTooltip(notes.length -1, "note");
  }

  moveNote(direction){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    let navs = data.photos[locationId].navs;
    let NoteID = this.state.noteID;
    let NavID = this.state.navID;
    let adj = this.state.adjustRate;
    if(NoteID >= notes.length){
      this.setState({noteID: 0});
      NoteID = 0;
    }
    if(NavID >= navs.length){
      this.setState({noteID: 0});
      NavID = 0;
    }
    //need to figure out what to do at 180 degrees
    if(this.state.noteOrNav == "note"){
      switch(direction){
        case "right":
        if(notes[NoteID].rotationY - adj > -180){
          notes[NoteID].rotationY -=adj;
        }
        else{
          notes[NoteID].rotationY *=-1;
        }
        break;
        case "left":
        if(notes[NoteID].rotationY + adj < 180){
          notes[NoteID].rotationY +=adj;
        }
        else{
          notes[NoteID].rotationY *=-1;
        }
        break;
        case "up":
        notes[NoteID].translateX -=adj;
        break;
        case "down":
        notes[NoteID].translateX +=adj;
        break;
      }
      data.photos[locationId].notes = notes;
    }

    if(this.state.noteOrNav == "nav"){
      switch(direction){
        case "right":
        if(navs[NavID].rotationY - adj > -180){
          navs[NavID].rotationY -=adj;
        }
        else{
          navs[NavID].rotationY *=-1;
        }
        break;
        case "left":
        if(navs[NavID].rotationY + adj < 180){
          navs[NavID].rotationY +=adj;
        }
        else{
          navs[NavID].rotationY *=-1;
        }
        break;
        case "up":
        navs[NavID].translateX -=adj;
        break;
        case "down":
        navs[NavID].translateX +=adj;
        break;
      }
      data.photos[locationId].navs = navs;
    }

    this.props.updateData(data);
  }

  editNote(index){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    this.selectTooltip(index, "note");
    if(notes.length> 0){
       this.openOverlay(index, "Text");
    }
    else{
      console.log("No notes");
    }
  }

  deleteNote(index){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
      if(index == this.state.noteID && this.overlayOpen1){
        NativeModules.DomOverlayModule.closeOverlay1();
        this.openOverlay(-1, "General");
      }
      else if(index == this.state.noteID){
        NativeModules.DomOverlayModule.closeOverlay1();
      }
      data.photos[locationId].notes.splice(index, 1);
      this.props.updateData(data);
      this.refreshTooltips();

    }

  updateText(obj){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    notes[this.state.noteID].text = obj.text;
    notes[this.state.noteID].title = obj.title;
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
      displayNotes: !this.state.displayNotes,
    })
  }

  toggleNavs(){
    this.setState({
      displayNavs: !this.state.displayNavs,
    })
  }

  selectTooltip(index, type){
    let {data, locationId} = this.props.photo;
    let notes = data.photos[locationId].notes;
    let navs = data.photos[locationId].navs;

    if(type == "note"){
      this.setState({noteID: index, noteOrNav: "note"});
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
      NativeModules.ClientModule.getRotation();

      setTimeout(function() {
        let rot = (this.state.cameraRot._y*57)%360;
        let obj = {
          rotation: notes[index].rotationY - rot,
          translation: 0, //notes[index].translateX
        };
        this.props.focusNote(obj);
      }.bind(this), 25);
    }

    if(type == "nav"){
      this.setState({navID: index, noteOrNav: "nav"});

      for(let i = 0; i < navs.length; i++){
        if(i == index){
          navs[i].selected = true;
        }
        else{
          navs[i].selected = false;
        }
      }
      data.photos[locationId].navs = navs;
      this.props.updateData(data);
      NativeModules.ClientModule.getRotation();

      setTimeout(function() {
        let rot = (this.state.cameraRot._y*57)%360;
        let obj = {
          rotation: navs[index].rotationY - rot,
          translation: 0, //notes[index].translateX
        };
        this.props.focusNote(obj);
      }.bind(this), 25);

      if(this.state.overlayOpen1){
        this.openOverlay(-1, "General");
      }
    }


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

  floorSelection(){
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
    let {currentFloor, floors} = this.props.location;
    let FL = JSON.parse(JSON.stringify(floors));
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
      NativeModules.DomOverlayModule.openOverlay2(locationId, currentFloor, FL);
    }
  }

  selectFloorRoom(obj){
    let {currentFloor} = this.props.location;
    let {locationId, data} = this.props.photo;
    if(obj.floor == currentFloor && obj.room == locationId){
      console.log("Already here.");
    }
    else{
      this.props.selectFloor(obj.floor);
      let roomData = this.props.location.floors[obj.floor];
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
    let fLocs = Object.keys(this.props.location.floors);
    floor = fLocs[0];
    let rLocs = Object.keys(this.props.location.floors[fLocs[0]].photos);
    room = rLocs[0];
    this.selectFloorRoom({floor, room});
    //this.props.changeNextLocationId(locs[0]);
    this.setState({displayNotes: false})
    NativeModules.DomOverlayModule.closeOverlay1();
    NativeModules.ClientModule.getRotation();
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

  save(){
    var url = this.props.jsonPath;
    var data = this.props.json;

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));

  }

  test(){
    console.log(this.props.jsonPath);
  }

  render() {
    let {data, locationId} = this.props.photo;
    const photoData = (locationId && data.photos[locationId]) || null;
    let notes = (photoData && photoData.notes) || null;
    let navs = (photoData && photoData.navs) || null;
    var lvls = [];
    for (let i = 2; i <= 20; i+=2){
      lvls.push(i);
    }

    if(!notes){
      notes = [];
    }
    if(!navs){
      navs = [];
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

        <VrButton style={styles.menuButton} onClick={this.test}>
               <Text style={styles.menuText}>Log It</Text>
        </VrButton>

{/*
        <VrButton style={styles.menuButton} onClick={this.save}>
               <Text style={styles.menuText}>Save</Text>
        </VrButton>
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
        <VrButton style={styles.menuButton} onClick={this.toggleNavs}>
          <Text style={styles.menuText}>Toggle Navs</Text>
        </VrButton>
        <VrButton style={styles.menuButton} onClick={this.createNote}>
          <Text style={styles.menuText}>Create Note</Text>
        </VrButton>

        <VrButton style={styles.menuButton} onClick={this.toggleNotes}>
          <Text style={styles.menuText}>Toggle Notes</Text>
        </VrButton>
      </View>
      {!this.state.overlayOpen2 &&
      <VrButton style={styles.selection} onClick={this.floorSelection}>
        <Image style={styles.selectionImage} source={asset('expand_arrow.png')}></Image>
      </VrButton>
      }
      {(this.state.displayNotes && notes.length == 0) && <View style={styles.noteList}>
      <VrButton>
        <Text style={styles.tooltipListItem}>
        No Notes For This Room
        </Text>
      </VrButton>
      </View>
    }
      {(this.state.displayNavs && navs.length > 0) && <View style={styles.navList}>
          {navs.map((nav, index) => {
          return(
            <View style={styles.tooltipListRow} key={index}>
              <VrButton onClick={() => this.selectTooltip(index, "nav")}>
                <Text style={(index==(this.state.navID) && (this.state.noteOrNav == "nav")) ? styles.tooltipListItemSelected : styles.tooltipListItem}>
                {nav.text}
                </Text>
              </VrButton>
            </View>);
        })}
      </View>}

      {(this.state.displayNotes && notes.length > 0) && <View style={styles.noteList}>
          {notes.map((note, index) => {
          return(
            <View style={styles.tooltipListRow} key={index}>
              <VrButton onClick={() => this.selectTooltip(index, "note")}>
                <Text style={(index==(this.state.noteID) && (this.state.noteOrNav == "note")) ? styles.tooltipListItemSelected : styles.tooltipListItem}>
                {note.title}
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

      {((this.state.displayNotes || this.state.displayNavs) && (notes.length > 0 || navs.length > 0)) && <View style={styles.pBButton}>
      <VrButton style={this.state.noteOrNav == "nav" ? styles.pBLeftNav : styles.pBLeft} onClick={() => this.moveNote("left")}>
        <Text style={styles.menuText}>Left</Text>
      </VrButton>
      <VrButton style={this.state.noteOrNav == "nav" ? styles.pBRightNav : styles.pBRight} onClick={() => this.moveNote("right")}>
        <Text style={styles.menuText}>Right</Text>
      </VrButton>
      {this.state.noteOrNav == "note" && <VrButton style={styles.pBUp} onClick={() => this.moveNote("up")}>
        <Text style={styles.menuText}>Up</Text>
      </VrButton>
      }
      {this.state.noteOrNav == "note" && <VrButton style={styles.pBDown} onClick={() => this.moveNote("down")}>
        <Text style={styles.menuText}>Down</Text>
      </VrButton>
      }
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
