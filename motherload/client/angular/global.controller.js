// Later use ~
angular
  .module('app')
  .controller('GlobalCtrl', ["$scope", "$location", "Factory",
    function (scope, location, Factory, ) {

      // ey!
      // var socket = io.connect(window.location.host);
      // var socket = io();

      scope.global = () => {
        console.log(scope.data);
      }

      scope.search = "";

      scope.newBuilding = () => {
        Factory.createBuilding(scope.newBldgObj).then(
          (res) => {
            if (res.data)
              scope.allBuildings.push(res.data);
            else
              console.log(res);
          } 
        );
      };

    }]
  )
  ;