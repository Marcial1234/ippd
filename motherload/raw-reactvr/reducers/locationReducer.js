const defaultState = {
  data: null,
  rotation: 0,
  locationId: null,
  nextLocationId: null,
  notes: null,
  gNotes: "",
  preview: false,
  floors: null,
  rooms: null,
  currentFloor: "0",
};

export default function location(state=defaultState, action){
    switch(action.type){
      case "Update":{
        return{...state, data : action.payload.data,
                         locationId : action.payload.locationId,
                         nextLocationId : action.payload.nextLocationId}
      }
      case "Change Location":{
        return{...state, locationId : action.payload}
      }
      case "Change Next Location":{
        // console.log("CNL:", action.payload);
        return{...state, nextLocationId : action.payload, rotation: 0}
      }
      case "Focus Note":{
        return{...state, rotation : action.payload}
      }
      case "Change Data":{
        return{...state, data : action.payload}
      }
      case "Change Notes":{
        return{...state, notes : action.payload}
      }
      case "Change gNotes":{
        return{...state, gNotes : action.payload}
      }
      case "Set Preview":{
        return{...state, preview : action.payload}
      }
      case "Init Floors":{
        return{...state, floors: action.payload.floors,
                         rooms: action.payload.rooms,
        }
      }
      case "Select Floor":{
        return{...state, currentFloor : action.payload}
      }
      case "Set Rooms":{
        return{...state, rooms : action.payload}
      }
      default :{
        return{...state}
      }
    }

}
