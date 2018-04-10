// Later use ~
angular
  .module('app')
  .controller('FormCtrl', ["$scope", "$location", "Factory",
    function (scope, location, Factory, ) {

      // used variables
      scope.allBuildings = [];

      Factory.getBuildings().then(
        (res) => {
          scope.allBuildings = res.data;
        }
      );

    }
  ])
  ;