import React from 'react';
// import Select from 'react-select';
// import 'react-select/dist/react-select.css';

//This is standard react.
export default class SelectorOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      floors: null,
      lRooms: null,
      lFloors: null,
      floor: props.floor || "01",
      room: props.room || "000001",
      updated: false,
    };

    this.goToRoom = this.goToRoom.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
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
    //
    // this.setState({updated: true});
    // setTimeout(function() {this.setState({updated: false});}.bind(this), 1000);
  }

  updateSelections(){
    this.setState({
      floors: Object.keys(this.props.floors),
      lFloors: Object.keys(this.props.floors),
      rooms: Object.keys(this.props.floors[this.state.floor].photos),
      lRooms: Object.keys(this.props.floors[this.state.floor].photos),
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
                   <select value={this.state.room} onChange={ (e) => {this.handleRoomChange(e, "update");}}>
                     {this.state.lRooms.map((num, index) =>
                        <option key={index}>
                          {num}
                        </option>
                      )}
                    </select>
                </div>
                <button onClick={this.goToRoom} className="selCol">GO</button>
                {this.state.updated && <img className="check" src="../static_assets/check.png"/>}
          </div>
        </div>
    )
  }
}