angular
  .module("app")
  .factory("Factory", ["$http", "$location",
    function(http, location) {

      return {

        // Picture Upload
        postPics: async (formdata, size) => {
          // THIS IS WHAT WORKED
          let request = {
            method: 'POST',
            url: '/upload',
            data: formdata,
            timeout: size * 300000,
            headers: {
              'Content-Type': undefined
            }
          }
          // console.log("sending ~")
          return http(request)
          // return await new Promise((res) => res(formdata.map(x => x)))
        },

        getStates: () => {
          return http.get("/api/getStates")
        },

        // Basic CRUD
        getFloors: () => {
          return http.get("/api/getAllFloors")
        },

        getBuildings: () => {
          return http.get("/api/getAllBuildings")
        },

        getBldgFloors: (id) => {
          return http.get("/api/building/" + id)
        },

        createFloor: (obj) => {
          return http.post("/api/floor", obj)
        },

        createBuilding: (obj) => {
          // console.log(obj)
          return http.post("/api/building", obj)
        },

        deleteFloor: (id) => {
          return http.delete("/api/floor/" + id)
        },

        deleteBuilding: (id) => {
          return http.delete("/api/building/" + id)
        },

        changePanoURL: (obj) => {
          // values inside are in the abc order needed
          // obj.pnewURL
          let customParams = Object.values(obj).join("/")
          return http.delete("/api/updatePanoramic/" + customParams)
        },

      }
    }
  ])
  
