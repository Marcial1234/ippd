export function updatePhoto(nextPhoto){
  return{
    type: "Update",
    payload: { zoomZ: nextPhoto.zoomZ,
                data: nextPhoto.data,
                rotation: nextPhoto.rotation,
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

export function changeZoom(zoom){
  return{
    type: "Change Zoom",
    payload: zoom,
  }
}

export function changeRotation(rot){
  return{
    type: "Change Rotation",
    payload: rot,
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
