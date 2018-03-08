export function initBuildings(obj){
  return{
    type: "Init Buildings",
    payload: { buildings: obj.buildings,
                floors: obj.floors,
                rooms: obj.rooms,
              }
  }
}

export function selectAll(obj){
  return{
    type: "Select All",
    payload: { currentBuidling: obj.building,
                currentFloor: obj.floor,
                roocurrentRoomms: obj.room,
              }
  }
}

export function selectBuilding(building){
  return{
    type: "Select Building",
    payload: building,
  }
}
export function selectFloor(floor){
  return{
    type: "Select Floor",
    payload: floor,
  }
}
export function selectRoom(room){
  return{
    type: "Select Room",
    payload: room,
  }
}
