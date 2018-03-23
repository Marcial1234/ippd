export function initFloors(obj){
  return{
    type: "Init Floors",
    payload: { floors: obj.floors,
                rooms: obj.rooms,
              }
  }
}

export function selectFloor(floor){
  return{
    type: "Select Floor",
    payload: floor,
  }
}
