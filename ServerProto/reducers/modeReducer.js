// "defaultState" should include all variables/objects that may be returned
// when actions are called.
const defaultState = {
  VRTextBox: true,
  text: "Current",
  StaticTextBox: false,
  input: "Text: ",
};

export default function mode(state=defaultState, action){
    //Each action type has a corresponding case
    //Each case returns a new state object with values updated accordingly
    switch(action.type){
      case "CREATE":{
        return{...state, VRTextBox:true, text: action.payload}
      }
      case "VIEW":{
        return{...state, VRTextBox:false, text: action.payload}
      }
      case "TEXTINPUTTOGGLE":{
        if(state.StaticTextBox)
        return{...state, StaticTextBox: false, text: action.payload.off}
        else
        return{...state, StaticTextBox: true, text: action.payload.on}
      }
      case "TextInput":{
        return{...state, input:action.payload}
      }
      default :{
        return{...state}
      }
    }

}
