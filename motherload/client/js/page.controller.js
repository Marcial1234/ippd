// Main controller
angular
  .module('app')
  .controller('PageCtrl', ["$scope", "$location", "$http",
    function (scope, location, http, ) {

      // pass room stuff as a state param?

      // Initial dimensions of the contiguous 'room'
      scope.x = 5, scope.y = 5;

      // on x/y change => recall this
      // try to maintain the current numbers?? add ability for r/l offsets << >>
      // Dynamically create a 2D array
      let createMatrix = () => {
        room_area = Array(scope.x).fill(0).map(x => Array(scope.y).fill(null));
        return room_area;
      };

      scope.meh = createMatrix();
      // scope.taken = createMatrix();

      // create x random rumbers up to x^2
      scope.picsOptions = [];
      for (var i = 0; i < scope.x; i++) {
        scope.picsOptions.push(Math.floor(Math.random() * (scope.x ** 2)));
      }

      console.log(scope.x, scope.y);
      console.log(scope.picsOptions);

      // console.log("Page Controller reporting for duty");
		}]
	)
	;