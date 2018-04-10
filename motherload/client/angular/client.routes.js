// Configure the Routes
let config = ['$routeProvider', '$locationProvider',
  ($routeProvider, $locationProvider) => {
    $routeProvider
      .when("/", {
        templateUrl: "partials/home.html",
      })

      // Pages
      .when("/FloorMap", {
        templateUrl: "partials/FloorMap.html",
      })

      .when("/newBuilding", {
        templateUrl: "partials/newBuilding.html",
      })

      .when("/upload", {
        templateUrl: "partials/ImageUploadStart.html",
      })

      .when("/us", {
        templateUrl: "partials/us.html",
      })

      // .when("/ImageUploadEdits", {
      //   controller: "PageCtrl",
      //   templateUrl: "partials/ImageUploadEdits.html",
      // })

      // .when("/VRStart", {
      //   controller: "PageCtrl",
      //   templateUrl: "partials/VRStart.html",
      // })

      // .when("/VRView", {
      //   controller: "PageCtrl",
      //   templateUrl: "partials/VRView.html",
      // })

      // .when("/LocationCreation", {
      //   controller: "PageCtrl",
      //   templateUrl: "partials/LocationCreation.html",
      // })

      // defaults
      .when("/404", {
        templateUrl: "partials/404.html",
      })
      
      .otherwise( {
        redirectTo: '/404',
      })
      ;

    // gets rid of '#' in the routes ~
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}];

angular
  .module('app.routes', ['ngRoute'])
  .config(config);