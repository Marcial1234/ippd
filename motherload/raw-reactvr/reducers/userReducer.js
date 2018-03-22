const defaultState = {
  name: "Username",
  status: "Viewer",
};

export default function user(state=defaultState, action){

    switch(action.type){
      case "ADMIN":{
        return{...state, status: "Admin"}
      }
      case "EDITOR":{
        return{...state, status: "Editor"}
      }
      default :{
        return{...state}
      }
    }

}
