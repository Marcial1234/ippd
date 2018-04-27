import React from 'react';

export default class SelectorOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      // change these from 'null' ~ causing odd errors every so often
      rooms: {},
      floors: {},
      lRooms: [],
      lFloors: [],
      room: props.room,
      floor: props.floor,
      updated: false,
    };

    this.goToRoom = this.goToRoom.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
  }

  componentDidMount(){
    this.updateSelections();
  }

  handleFloorChange(event, type) {
    this.setState({floor: event.target.value});
    if(type == "update"){
      setTimeout(function() {this.updateSelections()}.bind(this), 25);
    }
  }
  handleRoomChange(event, type) {
    this.setState({room: event.target.value});
    if(type == "update"){
      setTimeout(function() {this.updateSelections()}.bind(this), 25);
    }
  }

  updateSearch(event, type) {
    let uList;
    switch (type){
      case 'F':
      uList = this.state.floors;
      break;
      case 'R':
      uList = this.state.rooms;
      break;
    }

    uList = uList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });

    switch (type){
      case 'F':
      this.setState({lFloors: uList});
      break;
      case 'R':
      this.setState({lRooms: uList});
      break;
    }

  }


  goToRoom(){
    let obj ={
      floor: this.state.floor,
      room: this.state.room
    }

    this.props.submit(obj);
  }

  updateSelections() {
    let floorNames = [];

    if (this.props.floors) {
      for (var i = 0; i < this.props.floors.length; i++) {
        floorNames.push(this.props.floors[i].name);
      }
    }

    this.setState({
      rooms: Object.keys(this.props.rooms),
      lRooms: Object.keys(this.props.rooms),
      floors: floorNames,
      lFloors: floorNames,
    })
  }

  render(){
    if(!this.state.rooms){
      return null;
    }

    return (
      <div className="select-container">
        <div className="select-content">
          <div className="close2" onClick={this.props.onClose} />
          <div className="selCol">Floor:
            <select value={this.state.floor} onChange={ (e) => {this.handleFloorChange(e, "update");}}>
              {this.state.lFloors.map((num, index) =>
                <option key={index}>
                  {num}
                </option>
              )}
            </select>
          </div>
          <div className="selCol">Room:
            <select value={this.state.room} onChange={ (e)=> {this.handleRoomChange(e, "update");}}>
              {this.state.lRooms.map((num, index) =>
                <option key={index}>
                  {num}
                </option>
              )}
            </select>
          </div>
          <button onClick={this.goToRoom} className="selCol">GO</button>
          {this.state.updated && <img className="check" src="../static_assets/check.png" />}
        </div>
      </div>
    )
  }
}
