export function updatePhoto(nextPhoto){
  return{
    type: "Update",
    payload: { zoomZ: nextPhoto.zoomZ,
                data: nextPhoto.data,
                rotation: nextPhoto.rotation,
                locationId: nextPhoto.locationId,
                nextLocationId: nextPhoto.nextLocationId
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

export function updateData(data){
  return{
    type: "Change Data",
    payload: data,
  }
}
