angular
  .module('app')
  .controller('FloorsCtrl', ["$rootScope", "$scope", "$location", "Factory",
    function (rootScope, scope, location, Factory, ) {

      if (!rootScope.currentBldgId) {
        alert("No building refence found. Please browse to this page in a valid sequence")
        console.log(rootScope.currentBldgId)
        location.path("/")
      }

      const editFloor = (id) => {
	    // edit layout ~
      	// location.path("/FloorMap")
      }
    }]
  )