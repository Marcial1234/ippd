const defaultState = {
  buildings: null,
  floors: null,
  rooms: null,
  currentBuilding: "000001",
  currentFloor: "01",
};

export default function room(state=defaultState, action){
    switch(action.type){
      case "Init Buildings":{
        return{...state, buildings: action.payload.buildings,
                         floors: action.payload.floors,
                         rooms: action.payload.rooms,
        }
      }
      case "Select Building":{
        return{...state, currentBuilding : action.payload}
      }
      case "Select Floor":{
        return{...state, currentFloor : action.payload}
      }
      case "Select All":{
        return{...state, currentBuilding : action.payload.building,
                         currentFloor : action.payload.floor,
        }
      }
      default :{
        return{...state}
      }
    }

}
