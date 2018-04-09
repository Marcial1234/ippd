import React from 'react';
import {Text, View, VrButton, NativeModules, Image, asset} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to recieve calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      navID: -1,
      noteID: -1,
      adjustRate: 6,
      cameraRot: null,
      noteOrNav: "note",
      displayNavs: false,
      overlayOpen1: false,
      overlayOpen2: false,
      displayNotes: false,
    }

    this.test = this.test.bind(this);
    this.save = this.save.bind(this);
    this.goHome = this.goHome.bind(this);
    this.editNote = this.editNote.bind(this);
    this.moveNote = this.moveNote.bind(this);
    this.updateText = this.updateText.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.adjustRate = this.adjustRate.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.toggleNavs = this.toggleNavs.bind(this);
    this.openOverlay = this.openOverlay.bind(this);
    this.toggleNotes = this.toggleNotes.bind(this);
    this.selectTooltip = this.selectTooltip.bind(this);
    this.floorSelection = this.floorSelection.bind(this);
    this.refreshTooltips = this.refreshTooltips.bind(this);
    this.selectFloorRoom = this.selectFloorRoom.bind(this);
  }

  componentWillMount() {
    // will respond to the call for 'updateText', obj is the value recieved
    RCTDeviceEventEmitter.addListener('updateText', obj => {
      this.updateText(obj);
    });
    RCTDeviceEventEmitter.addListener('updateGNotes', obj => {
      this.save("gNotes", obj);
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

  componentDidMount() {
    setTimeout(function() {this.openOverlay(-1, "Select")}.bind(this), 500);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.photo.locationId !== this.props.photo.locationId) {
      NativeModules.DomOverlayModule.closeOverlay2();
      this.openOverlay(-1, "Select");

      if (this.state.overlayOpen1) {
        NativeModules.DomOverlayModule.closeOverlay1();
        this.openOverlay(-1, "General");
      }

      if (this.state.displayNotes) {
        this.refreshTooltips();
      }
    }
  }

  // Returns the correct url for DB queries for BOTH dev and production
  formatSearchQuery(query) {
    if (window.process.env.NODE_ENV === "production") {
      url = window.location.origin;
      // this will return the domain of the current site
      // 'http[s]://[domain].[extension]'
    }
    else {
      url = "http://localhost:5001";
    }

    return [url, query].join("/");
  }

  createNote() {
    let {data} = this.props.photo;
    let notes = data.notes;
    let ID = this.state.noteID;

    // ???
    if (ID >= notes.length || ID < 0) {
      this.setState({noteID: 0});
      ID = 0;
    }

    NativeModules.ClientModule.getRotation();
    setTimeout(function() {
      let rot = (this.state.cameraRot._y*57)%360;
    }.bind(this), 25);

    let newNote = {
      Type: "textblock",
      text: "It's Full!",
      title: "New Note",
      width: 1.3,
      height: 1.5,
      selected: false,
      rotationY: notes[ID] ? notes[ID].rotationY - 20 : 160,
      translateX: 0,
    }

    data.notes.push(newNote);
    this.save("notes", newNote, ID);
    this.props.updateData(data);

    if (this.state.displayNotes) {
      this.refreshTooltips();
    }
    else {
      this.toggleNotes();
    }
    this.selectTooltip(notes.length - 1, "note");
  }

  moveNote(direction) {
    let {data} = this.props.photo;
    let notes = data.notes;
    let navs = data.navs;

    let NoteID = this.state.noteID;
    let NavID = this.state.navID;
    let adj = this.state.adjustRate;

    // point of this?
    if (NoteID >= notes.length) {
      this.setState({noteID: 0});
      NoteID = 0;
    }

    if (NavID >= navs.length) {
      this.setState({noteID: 0});
      NavID = 0;
    }

    // need to figure out what to do at 180 degrees
    //  => make it 178 ~
    if (this.state.noteOrNav == "note") {
      switch(direction) {
        case "right":
          if (notes[NoteID].rotationY - adj > -180) {
            notes[NoteID].rotationY -=adj;
          }
          else {
            notes[NoteID].rotationY *=-1;
          }
          break;
        case "left":
          if (notes[NoteID].rotationY + adj < 180) {
            notes[NoteID].rotationY +=adj;
          }
          else {
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
      data.notes = notes;
    }

    if (this.state.noteOrNav == "nav") {
      switch(direction) {
        case "right":
          if (navs[NavID].rotationY - adj > -180) {
            navs[NavID].rotationY -=adj;
          }
          else {
            navs[NavID].rotationY *=-1;
          }
          break;
        case "left":
          if (navs[NavID].rotationY + adj < 180) {
            navs[NavID].rotationY +=adj;
          }
          else {
            navs[NavID].rotationY *=-1;
          }
          break;
      }
      this.save("navs", navs[NavID].rotationY, NavID);
      // data.navs = navs;
    }

    this.props.updateData(data);
  }

  editNote(index) {
    let {data} = this.props.photo;
    let notes = data.notes;
    this.selectTooltip(index, "note");

    if (notes.length> 0) {
       this.openOverlay(index, "Text");
    }
    else {
      console.log("No notes");
    }
  }

  deleteNote(index) {
    let {data} = this.props.photo;
    let notes = data.notes;

    if (index == this.state.noteID && this.overlayOpen1) {
      NativeModules.DomOverlayModule.closeOverlay1();
      this.openOverlay(-1, "General");
    }
    else if (index == this.state.noteID) {
      NativeModules.DomOverlayModule.closeOverlay1();
    }

    data.notes.splice(index, 1);
    this.props.updateData(data);
    this.refreshTooltips();
  }

  updateText(obj) {
    let {data} = this.props.photo;
    let notes = data.notes;

    notes[this.state.noteID].text = obj.text;
    notes[this.state.noteID].title = obj.title;
    data.notes = notes;

    this.props.updateData(data);
    this.refreshTooltips();
  }

  toggleNotes() {
    this.setState({
      noteOrNav: "note",
      displayNavs: false,
      displayNotes: !this.state.displayNotes,
    })
  }

  toggleNavs() {
    this.setState({
      noteOrNav: "nav",
      displayNavs: !this.state.displayNavs,
      displayNates: false,
    })
  }

  selectTooltip(index, type) {
    let {data} = this.props.photo;
    let notes = data.notes;
    let navs = data.navs;
    // console.log("Data", data, "Index:", index);

    if (type == "note") {
      this.setState({noteID: index, noteOrNav: "note"});
      
      if (this.state.overlayOpen1) {
         this.openOverlay(index, "Text");
      }

      for (let i = 0; i < notes.length; i++) {
          notes[i].selected = (i == index);
      }

      data.notes = notes;
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
    else if (type == "nav") {
      this.setState({navID: index, noteOrNav: "nav"});

      for (let i = 0; i < navs.length; i++) {
          navs[i].selected = (i == index);
      }

      data.navs = navs;
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

      if (this.state.overlayOpen1) {
        this.openOverlay(-1, "General");
      }

    }
  }

  adjustRate(direction) {
    switch (direction) {
      case "up":
        if (this.state.adjustRate < 20) {
          this.setState({adjustRate : this.state.adjustRate + 2 })
        }
        else {
            console.log("Adjust Rate Maxed");
        }
        break;
      case "down":
        if (this.state.adjustRate > 2) {
          this.setState({adjustRate : this.state.adjustRate - 2 })
        }
        else {
            console.log("Adjust Rate Minimized");
        }
      break;

    }
  }

  // What is rate? I figured out, but explain it somewhere ~ if not, maybe 'increment?'
  changeRate(magnitude) {
    this.setState({adjustRate : magnitude })
  }

  floorSelection() {
    if (this.state.overlayOpen2) {
      NativeModules.DomOverlayModule.closeOverlay2();
    }
    else {
      this.openOverlay(-1, "Select");
    }

  }

  refreshTooltips() {
    setTimeout(function() {this.toggleNotes()}.bind(this), 25);
    setTimeout(function() {this.toggleNotes()}.bind(this), 25);
  }

  openOverlay(index, type) {
    let {locationId, data} = this.props.photo;
    let notes = (data && data.notes) || null;
    let gNotes = (data && data.gNotes) || null;
    let {currentFloor, floors, rooms} = this.props.location;

    let FL = JSON.parse(JSON.stringify(floors));
    let RMS = JSON.parse(JSON.stringify(rooms));

    if (type == "Text") {
      NativeModules.DomOverlayModule.closeOverlay1();
      NativeModules.DomOverlayModule.openOverlay1(notes[index].text, notes[index].title, "Both", gNotes);
    }
    if (type == "General") {
      NativeModules.DomOverlayModule.closeOverlay1();
      NativeModules.DomOverlayModule.openOverlay1("", "", "General", gNotes);
    }
    if (type == "Select") {
      NativeModules.DomOverlayModule.closeOverlay2();
      NativeModules.DomOverlayModule.openOverlay2(locationId, currentFloor, FL, RMS);
    }
  }

  selectFloorRoom(obj) {
    let {currentFloor} = this.props.location;
    let {locationId, data} = this.props.photo;

    if (obj.floor == currentFloor && obj.room == locationId) {
      console.log("Already here.");
    }
    else if (obj.floor == currentFloor) {
      let roomData = this.props.location.rooms[obj.room];
      this.props.updatePhoto({
        zoomZ: 0,
        data: roomData,
        locationId: null,
        nextLocationId: obj.room,
        rotation: 0
      });
    }
    else {
      let jsonPath = ["api", "floor", this.props.location.floors[obj.floor].hash].join("/");
      fetch(this.formatSearchQuery(jsonPath))
        .then(response => response.json())
        .then(responseData => {
          this.props.selectFloor(obj.floor);
          let roomData = responseData.photos;
          let rdp = Object.keys(roomData);

          if (!rdp.includes(obj.room)) {
            obj.room = rdp[0];
          }

          this.props.updatePhoto({
            zoomZ: 0,
            data: roomData[obj.room],
            locationId: null,
            nextLocationId: obj.room,
            rotation: 0
          });

          let locs = Object.keys(roomData);
          // console.log();
          setTimeout(function() {this.props.changeNextLocationId(locs[0])}.bind(this), 25);
          setTimeout(function() {this.props.changeNextLocationId(locs[1])}.bind(this), 25);
          setTimeout(function() {this.props.changeNextLocationId(obj.room)}.bind(this), 25);
        })
        .done();
    }
  }

  goHome() {
    // console.log("Props:", this.props);
    let {data} = this.props.photo;
    let fLocs = Object.keys(this.props.location.floors);
    let rLocs = Object.keys(this.props.location.rooms);

    room = rLocs[0];
    floor = fLocs[0];

    this.selectFloorRoom({floor, room});
    //this.props.changeNextLocationId(locs[0]);
    this.setState({displayNotes: false})
    NativeModules.DomOverlayModule.closeOverlay1();

    // NativeModules.ClientModule.getRotation();
    // setTimeout(function() {
    //   let rot = (this.state.cameraRot._y*57)%360;
    //   let obj = {
    //     rotation: -rot,
    //     translation: 0,
    //   };
    //   this.props.focusNote(obj);
    // }.bind(this), 25);
    // NativeModules.DomOverlayModule.closeOverlay2();
  }

  save(type, obj, index = -1) {
    let {currentFloor, floors} = this.props.location;
    let {locationId} = this.props.photo;
    console.log(obj);

    // "/gNotes/:floor/:pindex/:note"
    if (type == "gNotes") {
      let jsonPath = ["api", type, floors[currentFloor].hash, locationId, obj].join("/");
      fetch(this.formatSearchQuery(jsonPath))
        .then(response => response.json())
        .then(responseData => {
          this.props.updateData(responseData.photos[locationId]);
          console.log("RD:", responseData);
        })
        .done();
    }
    // "/notes/:floor/:pindex/:nindex"
    else if (type == "notes") {
      let jsonPath = ["api", type, floors[currentFloor].hash, locationId, index].join("/");

      console.log(jsonPath);
      console.log(JSON.stringify(obj));

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      // 
      // $.ajax({
      //   type: "PUT", 
      //   url: this.formatSearchQuery(jsonPath), 
      //   data: JSON.stringify(obj),
      // })
      // .then(response => response.json())
      // .then(responseData => {
      //   //this.props.updateData(responseData.photos[locationId]);
      //   console.log("RD:", responseData);
      // })
      // .done();

      // the issue seems to lie here ~
      // https://github.com/matthew-andrews/isomorphic-fetch/issues/34
      // and still not working...
      fetch(this.formatSearchQuery(jsonPath), {
          cache: "default",

          method: "put",
          mode: 'no-cors',

          body: JSON.stringify(...obj),
          headers: { "Content-Type": "application/json" },
          // method: 'DELETE',
      })
      // .then(response => response.json())
      // .then(responseData => {
      //   //this.props.updateData(responseData.photos[locationId]);
      //   console.log("RD:", responseData);
      // })
      .done();
    }
    // "/navs/:floor/:pindex/:nindex/:newRotation"
    else if (type == "navs") {
      console.log(obj);
        let jsonPath = ["api", type, floors[currentFloor].hash, locationId, index, obj].join("/");
        fetch(this.formatSearchQuery(jsonPath))
          .then(response => response.json())
          .then(responseData => {
            this.props.updateData(responseData.photos[locationId]);
            console.log("RD:", responseData);
          })
          .done();
    }

    // var url = this.props.jsonPath;
    // var data = this.props.json;
    //
    // fetch(url, {
    //   method: 'POST', // or 'PUT'
    //   body: JSON.stringify(data),
    //   headers: new Headers({
    //     'Content-Type': 'application/json'
    //   })
    // }).then(res => res.json())
    // .catch(error => console.error('Error:', error))
    // .then(response => console.log('Success:', response));
  }

  test() {
    this.save("notes", "Test", 0);
  }

  render() {
    let {data} = this.props.photo;
    let notes = (data && data.notes) || null;
    let navs = (data && data.navs) || null;
    var lvls = [];

    for (let i = 2; i <= 20; i+=2) {
      lvls.push(i);
    }

    if (!notes) {
      notes = [];
    }
    if (!navs) {
      navs = [];
    }

    /* Overlay Menu */
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

        {/* does doesn't close the gNotes, only closes a note edit */}
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
      </VrButton>}

      {(this.state.displayNotes && notes.length == 0) && <View style={styles.noteList}>
      <VrButton>
        <Text style={styles.tooltipListItem}>
        No Notes For This Room
        </Text>
      </VrButton>
      </View>}
      
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
          if (note)
          return(
            // ignoring nulls
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
            </View>
          );
        })}
      </View>}

      {/* Side "Moving" Menus */}
      {((this.state.displayNotes && notes.length > 0) || (this.state.displayNavs && navs.length > 0)) && <View style={styles.pBButton}>
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
                key={index} onClick={() => this.changeRate(mag)}>
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
