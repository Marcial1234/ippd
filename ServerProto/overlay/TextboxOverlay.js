import React from 'react';


//This is standard react.
export default class TextboxOverlay extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.text,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }


  handleSubmit(event) {
    //This prevent the page from reloading on submit
    event.preventDefault();
    //this.props.submit(this.state.value);
    this.props.onClose();
  }

  render(){
    return (
      <div className="container">
        <div className="content">
          <div className="close" onClick={this.props.onClose} />
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Text Input:
                <textarea value={this.state.value} onChange={this.handleChange} style = {{height: 175, width: 250}} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
