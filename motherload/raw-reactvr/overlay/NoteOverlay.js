import React from 'react';

export default class NoteOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || "",
      title: this.props.title || "",
      gNotes: this.props.gNotes || "",
      updatedN: false,
      updatedG: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGNotesSubmit = this.handleGNotesSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleGNotesChange = this.handleGNotesChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleGNotesChange(event) {
    this.setState({gNotes: event.target.value});
  }
  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }


  handleSubmit(event) {
    //This prevents the page from reloading on submit
    event.preventDefault();
    let obj ={
      text: this.state.text,
      title: this.state.title,
    }
    this.props.submit(obj);
    this.setState({updatedN: true});
    setTimeout(function() {this.setState({updatedN: false});}.bind(this), 1000);
  }

  handleGNotesSubmit(event) {
    //This prevents the page from reloading on submit
    event.preventDefault();
    this.props.submitGNotes(this.state.gNotes);
    this.setState({updatedG: true});
    setTimeout(function() {this.setState({updatedG: false});}.bind(this), 1000);
  }


  render(){
      return (
          <div className="container">
            <div className="content">
              <div className="close1" onClick={this.props.onClose} />
                {(this.props.type == "Both") && <form onSubmit={this.handleSubmit}>
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
                      {this.state.updatedN && <img className="check" src="../static_assets/check.png"/>}
                    </li>
                  </ul>
                </form>
                }
                { (this.props.type == "Both" || this.props.type == "General") && <form className="gNotes" onSubmit={this.handleGNotesSubmit}>
                  <ul className="input-form">
                    <li className="form-item">
                      <label> Room Notes:  </label>
                      <textarea className="gNotes-textarea" value={this.state.gNotes} onChange={this.handleGNotesChange} />
                    </li>
                    <li >
                      <input className="form-submit" type="submit" value="Submit" />
                      {this.state.updatedG && <img className="check" src="../static_assets/check.png"/>}
                    </li>
                  </ul>
                </form>
                }
            </div>
          </div>
      )
  }
}
