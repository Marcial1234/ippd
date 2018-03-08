import React from 'react';


//This is standard react.
export default class SelectorOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      building: props.b,
      floor: props.f,
      room: props.r,
    };

    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBuildingChange(event) {
    this.setState({building: event.target.value});
  }
  handleFloorChange(event) {
    this.setState({floor: event.target.value});
  }
  handleRoomChange(event) {
    this.setState({room: event.target.value});
  }


  handleSubmit(event) {
    //This prevent the page from reloading on submit
    event.preventDefault();
    let obj ={
      building: this.state.building,
      floor: this.state.state,
      room: this.state.room,
    }
    this.props.submit(obj);
    //this.props.onClose();
  }

  render(){
    return (
      <div className="select-container">
        <div className="content">
            <p>Building: {this.state.building}</p>
            <p>Building: {this.state.floor}</p>
            <p>Building: {this.state.room}</p>
        </div>
      </div>
    )
  }
}
