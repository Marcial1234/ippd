export function updatelocation(nextPhoto){
  return{
    type: "Update",
    payload: {  data: nextPhoto.data,
                locationId: nextPhoto.locationId,
                nextLocationId: nextPhoto.nextLocationId,
                notes: nextPhoto.notes,
              },
  }
}

export function changeLocationId(locationId){
  return{
    type: "Change Location",
    payload: locationId,
  }
}
export function changeNextLocationId(locationId){
  return{
    type: "Change Next Location",
    payload: locationId,
  }
}

export function focusNote(obj){
  return{
    type: "Focus Note",
    payload: obj,
  }
}


export function updateData(data){
  return{
    type: "Change Data",
    payload: data,
  }
}

export function updateNotes(notes){
  // console.log("Notes: ", notes);
  return{
    type: "Change Notes",
    payload: notes,
  }
}

export function updateGNotes(notes){
  // console.log("Notes: ", notes);
  return{
    type: "Change gNotes",
    payload: notes,
  }
}

export function setPreview(preview){
  // console.log("Notes: ", notes);
  return{
    type: "Set Preview",
    payload: preview,
  }
}

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
