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
    payload: { building: obj.building,
                floor: obj.floor,
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
