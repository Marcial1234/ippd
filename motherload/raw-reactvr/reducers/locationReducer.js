const defaultState = {
  floors: null,
  rooms: null,
  currentFloor: "01",
};

export default function room(state=defaultState, action){
    switch(action.type){
      case "Init Floors":{
        return{...state, floors: action.payload.floors,
                         rooms: action.payload.rooms,
        }
      }
      case "Select Floor":{
        return{...state, currentFloor : action.payload}
      }
      default :{
        return{...state}
      }
    }

}
