import React from 'react';


//This is standard react.
export default class TextboxOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || "Empty",
      title: this.props.title || "Empty",
      building: props.b || "000001",
      floor: props.f || "01",
      room: props.r || "000001",
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSubmitSelection = this.handleSubmitSelection.bind(this);
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleTitleChange(event) {
    this.setState({title: event.target.value});
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

  render(){
    return (
      <div>
        <div className="container">
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
        <div className="select-container">
          <div className="select-content">
              <p>Building: {this.state.building}</p>
              <p>Floor: {this.state.floor}</p>
              <p>Room: {this.state.room}</p>
          </div>
        </div>
      </div>
    )
  }
}
