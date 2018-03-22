//All actions defined here
//The Type determines which reducer is run
//The payload is the variable or object passed to the reducer

export function createActiveMode(){
  return{
    type: "CREATE",
    payload: "Creator Mode",
  }
}

export function viewActiveMode(){
  return{
    type: "VIEW",
    payload: "Viewer Mode",
  }
}

export function textInputMode(){
  return{
    type: "TEXTINPUTTOGGLE",
    payload: {
      on: "Text Input On",
      off: "Text Input Off"
    }
  }
}

export function textInput(text){
    return{
      type:"TextInput",
      payload: text
    }
}
