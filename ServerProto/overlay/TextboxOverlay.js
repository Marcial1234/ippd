import React from 'react';


//This is standard react.
export default class TextboxOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || "Empty",
      title: this.props.title || "Empty",
      building: props.building || "000999",
      floor: props.floor || "01",
      room: props.room || "000001",
      buildings: null,
      lBuildings: null,
      floors: null,
      lFloors: null,
      rooms: null,
      lRooms: null,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSubmitSelection = this.handleSubmitSelection.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
    this.goToRoom = this.goToRoom.bind(this);

  }

  componentDidMount(){
    this.updateSelections();
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }
  handleBuildingChange(event, type) {
    this.setState({building: event.target.value});
    //console.log(event.target.value);
    if(type == "update"){
      setTimeout(function() {this.updateSelections()}.bind(this), 25);
    }
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
      case 'B':
      uList = this.state.buildings;
      break;
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
      case 'B':
      this.setState({lBuildings: uList});
      break;
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
      building: this.state.building,
      floor: this.state.floor,
      room: this.state.room
    }
    this.props.submitSelection(obj);
  }

  handleSubmit(event) {
    //This prevent the page from reloading on submit
    event.preventDefault();
    let obj ={
      text: this.state.text,
      title: this.state.title,
    }
    this.props.submit(obj);
    //this.props.onClose();
  }

  handleSubmitSelection(event) {
    //This prevent the page from reloading on submit
    event.preventDefault();
    let obj ={
      building: this.state.building,
      floor: this.state.state,
      room: this.state.room,
    }
    this.props.submitSelection(obj);
    //this.props.onClose();
  }

  updateSelections(){
    // console.log(this.props.bldgs);
    //  console.log("B:", this.state.building, "F:", this.state.floor);
    this.setState({
      buildings: Object.keys(this.props.bldgs),
      lBuildings: Object.keys(this.props.bldgs),
      floors: Object.keys(this.props.bldgs[this.state.building].floors),
      lFloors: Object.keys(this.props.bldgs[this.state.building].floors),
      rooms: Object.keys(this.props.bldgs[this.state.building].floors[this.state.floor].photos),
      lRooms: Object.keys(this.props.bldgs[this.state.building].floors[this.state.floor].photos),
    })
  }

  render(){
    // console.log("Buildings:", this.state.buildings);
    // console.log("Floors:", this.state.floors);
    // console.log("Rooms:", this.state.rooms);


    return (
      <div>
          {(this.props.type == "Text") && <div className="container">
          <div className="content">
            <div className="close" onClick={this.props.onClose} />
              <form onSubmit={this.handleSubmit}>
                <ul className="input-form">
                  <li className="form-item">
                    <label> Title: </label>
                    <input className="form-textbox" type="text" value={this.state.title} onChange={this.handleTitleChange} />
                  </li>
                  <li className="form-item">
                    <label> Info:  </label>
                    <textarea className="form-textarea" value={this.state.text} onChange={this.handleTextChange} />
                  </li>
                  <li >
                    <input className="form-submit" type="submit" value="Submit" />
                  </li>
                </ul>
              </form>
          </div>
        </div>
      }

      {(this.props.type == "Select" && this.state.rooms) && <div className="select-container">
        <div className="select-content">
              <div className="selCol">Building:
                 <select onChange={ (e) => {this.handleBuildingChange(e, "update");}}>
                   {this.state.lBuildings.map((num, index) =>
                    <option key={index}>
                      {num}
                    </option>
                  )}
                </select>
                </div>
                <div className="selCol">Floor:
                   <select onChange={ (e) => {this.handleFloorChange(e, "update");}}>
                     {this.state.lFloors.map((num, index) =>
                      <option key={index}>
                        {num}
                      </option>
                    )}
                  </select>
                </div>
                <div className="selCol">Room:
                   <select onChange={ (e) => {this.handleRoomChange(e, "update");}}>
                     {this.state.lRooms.map((num, index) =>
                        <option key={index}>
                          {num}
                        </option>
                      )}
                    </select>
                </div>
                <button onClick={this.goToRoom} className="selCol">GO</button>
          </div>
        </div>
      }
      </div>
    )
  }
}
//
// <input type="text" ref="query" value={this.state.building}
//      onChange={ (e) => {this.handleBuildingChange(e, "refresh"); this.updateSearch(e, "B")}} style={{width: 70}}/>
