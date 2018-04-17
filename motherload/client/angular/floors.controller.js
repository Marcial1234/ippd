angular
  .module('app')
  .controller('FloorsCtrl', ["$rootScope", "$scope", "$location", "Factory",
    function (rootScope, scope, location, Factory, ) {

      if (!rootScope.currentBldgId) {
        alert("No building refence found. Please browse to this page in a valid sequence")
        console.log(rootScope.currentBldgId)
        location.path("/")
      }
      else {
        Factory.getBldgFloors(rootScope.currentBldgId)
        .then((res) => rootScope.bldgFloors = res.data.floors)
      }

      const getDisclaimer = (type, name) => {
        let disclaimer = [" Deleting this", type, "('", 
                          name, "')",
                          "will ALSO delete ALL internal floors,\n",
                          "AND their notes.\n\n",
                          "Are you SURE you want to proceed?"
                          ].join(" ")
        
        return disclaimer
      }

      // figure this out later !~
      scope.delFloor = (id, name) => {
        console.log(id, name)

        if (confirm(getDisclaimer("floor", name))) {
          Factory.deleteFloor(id)
          .then((res) => {

            if (res.data._id) {
              rootScope.allFloors.some((item, index, floors) => {
                if (item.hash == res.data._id) {
                  rootScope.allFloors.splice(index, 1);
                  return true;
                }
              })
            }
          })
        }
      }

      scope.editFloor = (id) => {
	    // edit layout ~
      	// location.path("/FloorMap")
      }
    }]
  )