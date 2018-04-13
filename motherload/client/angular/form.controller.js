// Later use ~
angular
  .module('app')
  .controller('FormCtrl', ["$scope", "$location", "Factory",
    function (scope, location, Factory, ) {

      // used variables
      scope.allFloors = [];
      scope.allBuildings = [];

      scope.dummyFloors = [
        {name: "Top Secret FBI Floor"},
        {name: "Spring 2018 UF Finals"},
        {name: "Next year's ad campain materials"},
      ];

      Factory.getBuildings().then(
        (res) => {
          scope.allBuildings = res.data;
        }
      );

      Factory.getFloors().then(
        (res) => {
          scope.allFloors = res.data;
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
            if (res._id) {
              scope.allBuildings.some((item, index, blds) => {
                if (item._id == res._id) {
                  blds.splice(index, 1);
                  return true;
                }
              })
            }
          })
        }
      }

      scope.delFloor = (id, name) => {
        if (confirm(getDisclaimer("floor", name))) {
          Factory.deleteFloor(id)
          .then((res) => {
            if (res._id) {
              scope.allFloors.some((item, index, blds) => {
                if (item._id == res._id) {
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