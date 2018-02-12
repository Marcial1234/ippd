const defaultState = {
  zoomZ: 0,
  data: null,
  rotation: null,
  locationId: null,
  nextLocationId: null,
};

export default function user(state=defaultState, action){
    //let {zoomZ, data, rotation, locationId, nextLocationId,} = action.payload;
    switch(action.type){
      case "Update":{
        return{...state, zoomZ : action.payload.zoomZ,
                         data : action.payload.data,
                         rotation : action.payload.rotation,
                         locationId : action.payload.locationId,
                         nextLocationId : action.payload.nextLocationId}
      }
      case "Change Location":{
        return{...state, locationId : action.payload}
      }
      case "Change Next Location":{
        return{...state, nextLocationId : action.payload}
      }
      case "Change Zoom":{
        return{...state, zoomZ : state.zoomZ + action.payload}
      }
      default :{
        return{...state}
      }
    }

}
