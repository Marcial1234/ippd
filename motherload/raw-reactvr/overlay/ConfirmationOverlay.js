import React from 'react';

//This is standard react.
export default class ConfirmationOverlay extends React.Component{

  constructor() {
    super();
    this.submitConfirmation = this.submitConfirmation.bind(this);
  }

  submitConfirmation(confirm){
    let obj = {
      index: this.props.index,
      confirm: confirm
    };

    this.props.submit(obj);
  }

  render(){
    let main_message = "Are you sure you want to delete?";
    let mini_message = "This process cannot be undone.";
      return (
          <div className="confirm-container">
            <div className="confirm-main">{main_message}</div>
            <div className="confirm-message">{mini_message}</div>
            <button className="confirm-yes" onClick={ () => {this.submitConfirmation("Yes")}}>
              Yes
            </button>
            <button className="confirm-no" onClick={ () => {this.submitConfirmation("No")}}>
              No
            </button>
          </div>
      )
  }
}
