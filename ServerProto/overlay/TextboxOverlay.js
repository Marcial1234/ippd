import React from 'react';


//This is standard react.
export default class TextboxOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || "Empty",
      title: this.props.title || "Empty",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleTitleChange(event) {
    this.setState({title: event.target.value});
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

  render(){
    return (
        <div className="container">
          <div className="content">
            <div className="close1" onClick={this.props.onClose} />
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
    )
  }
}
//
// <input type="text" ref="query" value={this.state.building}
//      onChange={ (e) => {this.handleBuildingChange(e, "refresh"); this.updateSearch(e, "B")}} style={{width: 70}}/>
