angular
  .module("app")
  .factory("Factory", ["$http", "$window",
    function(http, window) {

      let serverMethods = {
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
