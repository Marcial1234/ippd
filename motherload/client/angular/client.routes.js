// Configure the Routes
let config = ['$routeProvider', '$locationProvider',
  ($routeProvider, $locationProvider) => {
    $routeProvider
      // base/'abstract'
      .when("/", {
        templateUrl: "partials/home.html",
      })

      // Pages
      .when("/searchNotes", {
        templateUrl: "partials/searchNotes.html",
      })

      .when("/FloorMap", {
        templateUrl: "partials/FloorMap.html",
      })

      .when("/newBuilding", {
        templateUrl: "partials/newBuilding.html",
      })

      .when("/upload", {
        templateUrl: "partials/upload.html",
      })

      .when("/viewFloors", {
        templateUrl: "partials/viewFloors.html",
      })

      .when("/us", {
        templateUrl: "partials/us.html",
      })

      // defaults
      .when("/404", {
        templateUrl: "partials/404.html",
      })
      
      .otherwise( {
        redirectTo: '/404',
      })

    // gets rid of '#' in the routes ~
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
}]

angular
  .module('app.routes', ['ngRoute'])
  .config(config)