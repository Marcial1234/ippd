import React from 'react';
import {Text, View, VrButton, NativeModules, Image, asset} from 'react-vr';
import styles from '../static_assets/styles'

//This is to be able to receive calls from the DomOverlay
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
export default class StaticLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      navID: -1,
      noteID: -1,
      moveRate: 6,
      cameraRot: null,
      noteOrNav: "note",
      displayNavs: false,
      NotesOpen: false,
      SelectorOpen: false,
      noteListOpen: false,
    }

    this.save = this.save.bind(this);
    this.goHome = this.goHome.bind(this);
    this.editNote = this.editNote.bind(this);
    this.moveNote = this.moveNote.bind(this);
    this.moveNav = this.moveNav.bind(this);
    this.updateText = this.updateText.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.adjustMoveRate = this.adjustMoveRate.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.toggleNavs = this.toggleNavs.bind(this);
    this.openOverlay = this.openOverlay.bind(this);
    this.toggleNotes = this.toggleNotes.bind(this);
    this.selectTooltip = this.selectTooltip.bind(this);
    this.floorSelection = this.floorSelection.bind(this);
    this.refreshTooltips = this.refreshTooltips.bind(this);
    this.selectFloorRoom = this.selectFloorRoom.bind(this);
    this.setRotation = this.setRotation.bind(this);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
  }

  componentWillMount() {
    // will respond to the corresponding calls in DomOverlayModule
    RCTDeviceEventEmitter.addListener('updateText', obj => {
      this.updateText(obj);
    });
    RCTDeviceEventEmitter.addListener('updateGNotes', obj => {
      this.save("gNotes", obj);
    });
    RCTDeviceEventEmitter.addListener('closeNotes', () => {
      this.setState({NotesOpen: false,})
    });
    RCTDeviceEventEmitter.addListener('closeSelector', () => {
      this.setState({SelectorOpen: false,})
    });
    RCTDeviceEventEmitter.addListener('openNotes', () => {
      this.setState({NotesOpen: true,})
    });
    RCTDeviceEventEmitter.addListener('openSelector', () => {
      this.setState({SelectorOpen: true,})
    });
    RCTDeviceEventEmitter.addListener('selectFloorRoom', obj => {
      this.selectFloorRoom(obj);
    });
    RCTDeviceEventEmitter.addListener('deleteConfirm', obj => {
      this.deleteConfirmation(obj);
    });

    //responds to function in ClientModule
    RCTDeviceEventEmitter.addListener('cameraRot', obj => {
      this.setState({cameraRot: obj});
    });
  }

  componentDidMount() {
      //initial delay gives props time to load.
        setTimeout(function() {
          if (this.props.location.preview == "") {
                this.openOverlay(-1, "Select")
          }

          //clear any lingering selections
          let {data} = this.props.location;
          let notes = data.notes;
          for (let i = 0; i < notes.length; i++){
              notes[i].selected = false;
          }
        }.bind(this), 500);

  }

  componentDidUpdate(prevProps) {
    //check if moving to new location
    if (prevProps.location.locationId !== this.props.location.locationId) {
      //reset states so no notes or navs are selected on location change
      this.setState({
        navID: -1,
        noteID: -1,
      })

      NativeModules.DomOverlayModule.closeConfirm();
      NativeModules.DomOverlayModule.closeSelector();
      if (this.props.location.preview == ""){
            this.openOverlay(-1, "Select");
      }

      if (this.state.NotesOpen) {
        NativeModules.DomOverlayModule.closeNotes();
        this.openOverlay(-1, "General");
      }

      if (this.state.noteListOpen) {
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
    let {data} = this.props.location;
    let notes = data.notes;

    //set ID of new note to be 1 past the last index
    let ID = notes.length;

    //get current facing direction
    NativeModules.ClientModule.getRotation();
    //use delay to let props process
    setTimeout(function() {
      //get facing direction then ensure it is between -180 and 180 to fit in CylindricalPanel
      let rot = (this.state.cameraRot._y*57)%360;
      rot += this.props.location.rotation;
      if (rot > 180){
        let diff = (rot - 180);
        rot*=-1;
        rot = -180 + diff;
      }
      if (rot < -180){
        let diff = (rot + 180);
        rot*=-1;
        rot = 180 + diff;
      }

      //create New Note object.

      let newNote = {
        Type: "textblock",
        text: "This is default text, waiting to be changed.",
        title: "New Note",
        width: 1.3,
        height: 1.5,
        selected: false,
        rotationY: rot,
        translateX: 0,
      }
      this.save("notes", newNote, ID);
      this.setState({
        noteID : ID
      });
    }.bind(this), 25);

  }

  moveNote(direction) {
    let {data} = this.props.location;
    let notes = data.notes;

    let NoteID = this.state.noteID;
    let moveRate = this.state.moveRate;

    switch(direction) {
        case "right":
          if (notes[NoteID].rotationY - moveRate > -180) {
            notes[NoteID].rotationY -=moveRate;
          }
          else {
            notes[NoteID].rotationY *=-1;
          }
          break;
        case "left":
          if (notes[NoteID].rotationY + moveRate < 180) {
            notes[NoteID].rotationY +=moveRate;
          }
          else {
            notes[NoteID].rotationY *=-1;
          }
          break;
        case "up":
          notes[NoteID].translateX -=moveRate;
          break;
        case "down":
          notes[NoteID].translateX +=moveRate;
          break;
      }

      //CylindricalPanel won't display at ~180 or ~-180
      if(notes[NoteID].rotationY > 177 && notes[NoteID].rotationY < 180)
        notes[NoteID].rotationY = 177;
      if(notes[NoteID].rotationY >= 180 && notes[NoteID].rotationY < 183)
          notes[NoteID].rotationY = 183;
      if(notes[NoteID].rotationY < -177 && notes[NoteID].rotationY > -180)
        notes[NoteID].rotationY = -177;
      if(notes[NoteID].rotationY <= -180 && notes[NoteID].rotationY > -183)
          navs[NoteID].rotationY = -183;
      this.save("notes", notes[NoteID], NoteID);

  }

  moveNav(direction) {
    let {data} = this.props.location;
    let navs = data.navs;

    let NavID = this.state.navID;
    let moveRate = this.state.moveRate;

      switch(direction) {
        case "right":
          if (navs[NavID].rotationY - moveRate > -180) {
            navs[NavID].rotationY -=moveRate;
          }
          else {
            navs[NavID].rotationY *=-1;
          }
          break;
        case "left":
          if (navs[NavID].rotationY + moveRate < 180) {
            navs[NavID].rotationY +=moveRate;
          }
          else {
            navs[NavID].rotationY *=-1;
          }
          break;
      }
      //CylindricalPanel won't display at ~180 or ~-180
      if(navs[NavID].rotationY > 177 && navs[NavID].rotationY < 180)
        navs[NavID].rotationY = 177;
      if(navs[NavID].rotationY >= 180 && navs[NavID].rotationY < 183)
          navs[NavID].rotationY = 183;
      if(navs[NavID].rotationY < -177 && navs[NavID].rotationY > -180)
        navs[NavID].rotationY = -177;
      if(navs[NavID].rotationY <= -180 && navs[NavID].rotationY > -183)
          navs[NavID].rotationY = -183;
      this.save("navs", navs[NavID].rotationY, NavID);

  }

  editNote(index) {
    let {data} = this.props.location;
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
    let {data} = this.props.location;
    let notes = data.notes;

    NativeModules.DomOverlayModule.openConfirm(index);
  }

  deleteConfirmation(obj){
    if(obj.confirm == "Yes"){
      console.log(obj.index, this.state.noteID, this.state.NotesOpen);
      //if deleting selected note & overlay is open close note overlay and open reopen overlay with just "general notes"
      if (obj.index == this.state.noteID && this.state.NotesOpen) {
        NativeModules.DomOverlayModule.closeNotes();
        this.openOverlay(-1, "General");
      }

      this.save("delete", "", obj.index);
    }
    NativeModules.DomOverlayModule.closeConfirm();
  }

  updateText(obj) {
    let {data} = this.props.location;
    let notes = data.notes;
    let note = notes[this.state.noteID];

    note.text = obj.text;
    note.title = obj.title;

    this.save("notes", note, this.state.noteID);
    this.refreshTooltips();
  }

  toggleNotes() {
    this.setState({
      noteOrNav: "note",
      displayNavs: false,
      noteListOpen: !this.state.noteListOpen,
    })
  }

  toggleNavs() {
    this.setState({
      noteOrNav: "nav",
      displayNavs: !this.state.displayNavs,
      noteListOpen: false,
    })
  }

  selectTooltip(index, type) {
    let {data} = this.props.location;
    let notes = data.notes;
    let navs = data.navs;

    if (type == "note") {
      this.setState({noteID: index, noteOrNav: "note"});

      if (this.state.NotesOpen) {
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
        let obj = notes[index].rotationY - rot;
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
        let obj = navs[index].rotationY - rot;
        this.props.focusNote(obj);
      }.bind(this), 25);

      if (this.state.NotesOpen) {
        this.openOverlay(-1, "General");
      }

    }
  }

  adjustMoveRate(direction) {
    switch (direction) {
      case "up":
        if (this.state.moveRate < 20) {
          this.setState({moveRate : this.state.moveRate + 2 })
        }
        break;
      case "down":
        if (this.state.moveRate > 2) {
          this.setState({moveRate : this.state.moveRate - 2 })
        }
      break;

    }
  }

  // What is rate? I figured out, but explain it somewhere ~ if not, maybe 'increment?'
  changeRate(magnitude) {
    this.setState({moveRate : magnitude })
  }

  floorSelection() {
    if (this.state.SelectorOpen) {
      NativeModules.DomOverlayModule.closeSelector();
    }
    else {
      this.openOverlay(-1, "Select");
    }

  }

  refreshTooltips() {
    //use timeout so commands don't execute at exactly the same time.
    setTimeout(function() {this.toggleNotes()}.bind(this), 125);
    setTimeout(function() {this.toggleNotes()}.bind(this), 125);
  }

  openOverlay(index, type) {
    let {locationId, data, currentFloor, floors, rooms} = this.props.location;
    let notes = (data && data.notes) || null;
    let gNotes = (data && data.gNotes) || null;

    //convert to strings so they can be passed correctly.
    let FLS = JSON.parse(JSON.stringify(floors));
    let RMS = JSON.parse(JSON.stringify(rooms));

    let floor = floors[currentFloor].name;
    console.log("The Floor:", floor);

    if (type == "Text") {
      NativeModules.DomOverlayModule.closeNotes();
      NativeModules.DomOverlayModule.openNotes(notes[index].text, notes[index].title, "Both", gNotes);
    }
    if (type == "General") {
      NativeModules.DomOverlayModule.closeNotes();
      NativeModules.DomOverlayModule.openNotes("", "", "General", gNotes);
    }
    if (type == "Select") {
      NativeModules.DomOverlayModule.closeSelector();
      NativeModules.DomOverlayModule.openSelector(locationId.toString(), floor, FLS, RMS);
    }
  }

  selectFloorRoom(obj) {
    let {locationId, data, currentFloor, floors, rooms} = this.props.location;

    //obj contains the floor name. make floor = the index of the floor name
    let test = floors.find(o => o.name === obj.floor);
    let floor = floors.indexOf(test);

    //same floor, same location ID = already here
    if (obj.floor == currentFloor && obj.room == locationId) {
      console.log("Already here.");
    }
    //same floor or trying to navigate to floor that doesn't exist
    else if (floor == currentFloor || floor == -1) {
      let roomData = rooms[obj.room];
      this.props.updatelocation({
        data: roomData,
        locationId: null,
        nextLocationId: obj.room,
      });
    }
    //new floor, new room.
    //retrieve new floor data from databsse
    else {
      let jsonPath = ["api", "floor", floors[floor].hash].join("/");
      fetch(this.formatSearchQuery(jsonPath))
        .then(response => response.json())
        .then(responseData => {
          let roomData = responseData.photos;

          this.props.selectFloor(floor);
          this.props.setRooms(roomData);

          let rdp = Object.keys(roomData);
          //if trying to navigate to room that doesn't exist, default to room #1
          if (!rdp.includes(obj.room)) {
            obj.room = rdp[0];
          }

          this.props.updatelocation({
            data: roomData[obj.room],
            locationId: obj.room,
            nextLocationId: obj.room,
          });
        })
        .done();
    }
  }

  goHome() {
    // Go to first photo
    let {data} = this.props.location;
    console.log(this.props);
    let fLocs = Object.keys(this.props.location.floors);
    let rLocs = Object.keys(this.props.location.rooms);

    room = rLocs[0];
    floor = fLocs[0];

    this.selectFloorRoom({floor, room});
    this.setState({noteListOpen: false})
    NativeModules.DomOverlayModule.closeNotes();
  }

  save(type, obj, index = -1) {
    let {locationId, currentFloor, floors} = this.props.location;

    // "/gNotes/:floor/:pindex/:note"
    if (type == "gNotes") {
      let jsonPath = ["api", type, floors[currentFloor].hash, locationId, obj].join("/");
      fetch(this.formatSearchQuery(jsonPath))
        .then(response => response.json())
        .then(responseData => {
          this.props.updateData(responseData.photos[locationId]);

        })
        .done();
    }
    // "/notes/:floor/:pindex/:nindex" -> method: post
    else if (type == "notes") {
      let jsonPath = ["api", type, floors[currentFloor].hash, locationId, index].join("/");
      fetch(this.formatSearchQuery(jsonPath), {
          body: JSON.stringify(obj),
          headers: { "Content-Type": "application/json" },
          method: "POST",
      })
      .then(response => response.json())
      .then(responseData => {
        this.props.updateData(responseData.photos[locationId]);

        this.selectTooltip(index, "note");
        if (this.state.noteListOpen) {
          this.refreshTooltips();
        }
        else {
          this.toggleNotes();
        }
      })
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
            // this.selectTooltip(index, "nav");
          })
          .done();
    }
    //"/notes/:floor/:pindex/:nindex" -> method:delete
    else if (type == "delete") {
      let jsonPath = ["api", "notes", floors[currentFloor].hash, locationId, index].join("/");
      fetch(this.formatSearchQuery(jsonPath), {
          method: "DELETE",
      })
      .then(response => response.json())
      .then(responseData => {
        this.props.updateData(responseData.photos[locationId]);
        this.refreshTooltips();
      })
      .done();
    }
  }

  setRotation(){
    let {data} = this.props.location;
    NativeModules.ClientModule.getRotation();
    //Client Module returns Camera Rotation to the listener
    //use timeout to give time for state to update
    setTimeout(function() {
      //multiply rotation from ClientModule.getRotation by 57 to approximately convert radians to degrees
      //%360 to make the value always fall between 0-360. Otherwise the number can be infinitely high.
      //0-360 fits within the bounds
      let rot = (this.state.cameraRot._y*57)%360;
      data.rotationOffset = rot;

      this.props.updateData(data);
    }.bind(this), 25);
  }

  render() {
    let {data} = this.props.location;
    let notes = (data && data.notes) || null;
    let navs = (data && data.navs) || null;
    var adjustRateArray = [];
    //range of values for adjust rate.
    for (let i = 2; i <= 20; i+=2) {
      adjustRateArray.push(i);
    }

    //if notes or navs don't exist, create empty array for them so code doesn't break;
    if (!notes) {
      notes = [];
    }
    if (!navs) {
      navs = [];
    }

    /* Overlay Menu */
    return (
      <View >
        {this.props.location.preview == "" && <View>
          <View style={styles.menu}>
            <VrButton style={styles.menuButton} onClick={this.goHome}>
              <Text style={styles.menuText}>Home</Text>
            </VrButton>

            {/* does doesn't close the gNotes, only closes a note edit */}
            <VrButton style={styles.menuButton} onClick={ () => this.openOverlay(-1, "General")}>
                   <Text style={styles.menuText}>Room Notes</Text>
            </VrButton>
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

          {!this.state.SelectorOpen &&
          <VrButton style={styles.selection} onClick={this.floorSelection}>
            <Image style={styles.selectionImage} source={asset('expand_arrow.png')}></Image>
          </VrButton>}

          {(this.state.noteListOpen && notes.length == 0) && <View style={styles.noteList}>
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

          {(this.state.noteListOpen && notes.length > 0) && <View style={styles.noteList}>
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
          {(this.state.displayNavs && navs.length > 0 && this.state.noteOrNav == "nav") && <View style={styles.pBButton}>
          <VrButton style={styles.pBLeftNav} onClick={() => this.moveNav("left")}>
            <Text style={styles.menuText}>Left</Text>
          </VrButton>
          <VrButton style={styles.pBRightNav} onClick={() => this.moveNav("right")}>
            <Text style={styles.menuText}>Right</Text>
          </VrButton>
        </View>}

          {(this.state.noteListOpen && notes.length > 0 && this.state.noteOrNav == "note") && <View style={styles.pBButton}>
          <VrButton style={styles.pBLeft} onClick={() => this.moveNote("left")}>
            <Text style={styles.menuText}>Left</Text>
          </VrButton>
          <VrButton style={styles.pBRight} onClick={() => this.moveNote("right")}>
            <Text style={styles.menuText}>Right</Text>
          </VrButton>
          {<VrButton style={styles.pBUp} onClick={() => this.moveNote("up")}>
            <Text style={styles.menuText}>Up</Text>
          </VrButton>
          }
          {<VrButton style={styles.pBDown} onClick={() => this.moveNote("down")}>
            <Text style={styles.menuText}>Down</Text>
          </VrButton>
          }
        </View>}

          {(this.state.noteListOpen || this.state.displayNavs) && <View>

          <VrButton style={styles.pBPlus} onClick={() => this.adjustMoveRate("up")}>
            <Text style={styles.menuText}>+</Text>
          </VrButton>
          <VrButton style={styles.pBRate}>
            <Text style={styles.menuText}>{this.state.moveRate}</Text>
          </VrButton>
          <VrButton style={styles.pBMinus} onClick={() => this.adjustMoveRate("down")}>
            <Text style={styles.menuText}>-</Text>
          </VrButton>
          <View style={styles.pBRateBar}>
            {adjustRateArray.map((mag, index) => {
              return(
                <VrButton style={(this.state.moveRate == mag) ? styles.pBRateBarButtonSelected : styles.pBRateBarButton}
                    key={index} onClick={() => this.changeRate(mag)}>
                      <Text style={styles.barText}>{mag}</Text>
                </VrButton>
              );
            })}
          </View>
        </View>}
          </View>}
      </View>
    );
  }
}
