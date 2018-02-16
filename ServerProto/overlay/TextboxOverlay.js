import React from 'react';


//This is standard react.
export default class TextboxOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      title: this.props.title,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          <div className="close" onClick={this.props.onClose} />
          <div>
            <form>
              <label>
                Title:
                <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
              </label>
            </form>
            <form onSubmit={this.handleSubmit}>
              <label>
                <textarea value={this.state.text} onChange={this.handleTextChange} style = {{height: 100, width: 250}} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
