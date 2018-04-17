// Later use ~
angular
  .module('app')
  .controller('FormCtrl', ["$rootScope", "$scope", "$location", "Factory",
    function (rootScope, scope, location, Factory, ) {

      // used variables
      rootScope.allFloors = [];
      rootScope.allBuildings = [];

      Factory.getBuildings()
      .then(
        (res) => {
          rootScope.allBuildings = res.data;
        }
      );

      Factory.getFloors()
      .then(
        (res) => {
          rootScope.allFloors = res.data;
        }
      );
      
      const getDisclaimer = (type, name) => {
        let disclaimer = [" Deleting this", type, "('", 
                          name, "')",
                          "will ALSO delete ALL internal floors,\n",
                          "AND their notes.\n\n",
                          "Are you SURE you want to proceed?"
                          ].join(" ")
        
        return disclaimer
      }

      scope.delBldg = (id, name) => {
        if (confirm(getDisclaimer("building", name))) {
          Factory.deleteBuilding(id)
          .then((res) => {
            console.log(res.data)
            if (res.data._id) {
              scope.allBuildings.some((item, index, blds) => {
                if (item._id == res.data._id) {
                  blds.splice(index, 1);
                  return true;
                }
              })
            }
          })
        }
      }

    }
  ])
  ;