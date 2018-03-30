export function adminLogin(name){
  return{
    type: "ADMIN",
    payload: name,
  }
}

export function editorLogin(name){
  return{
    type: "EDITOR",
    payload: name,
  }
}
