angular
  .module("app")
  .factory("Factory", ["$http", "$window",
    function(http, window) {

      let serverMethods = {
        // Picture Upload
        postPics: (formdata) => {
          // THIS IS WHAT WORKED
          let request = {
            method: 'POST',
            url: '/upload',
            data: formdata,
            headers: {
              'Content-Type': undefined
            }
          }

          console.log(formdata)
          return http(request)
        },

        // Basic CRUD
        getFloors: () => {
          return http.get("/api/getAllFloors");
        },

        getBuildings: () => {
          return http.get("/api/getAllBuildings");
        },

        createFloor: (obj) => {
          return http.post("/api/floor/", obj);
        },

        createBuilding: (obj) => {
          return http.post("/api/building/", obj);
        },

        deleteFloor: (id) => {
          return http.delete("/api/floor/" + id);
        },

        deleteBuilding: (id) => {
          return http.delete("/api/building/" + id);
        },

        changePanoURL: (obj) => {
          // values inside are in the abc order needed
          // obj.pnewURL
          let customParams = Object.values(obj);
          return http.delete("/api/updatePanoramic/" + customParams);
        },

      };

      return serverMethods;
    }
  ])
  ;
