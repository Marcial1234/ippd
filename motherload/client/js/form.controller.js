// Later use ~
angular
  .module('app')
  .controller('FormCtrl', ["$scope", "$location", "$http",
    function ($scope, $location, $http, ) {

      // ~~~
      console.log("Page Controller reporting for duty");
      console.log("formCtrl reporting for duty");

      $scope.building = '01';
      $scope.floor = '01';
      $scope.room = '01';

      // $scope.submit = () => {
      //   // TBD
      // };

    }]
  )
  ;