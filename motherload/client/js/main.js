var app = angular.module('tutorialWebApp', [
  'ngRoute',
]);

// Configure the Routes
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", { templateUrl: "partials/home.html", controller: "PageCtrl"})

    // Pages
    .when("/ImageUploadStart", { 
        controller: "PageCtrl",
        templateUrl: "partials/ImageUploadStart.html", 
    })
    .when("/ImageUploadEdits", { 
        controller: "PageCtrl",
        templateUrl: "partials/ImageUploadEdits.html", 
    })
    .when("/VRStart", { 
        controller: "PageCtrl",
        templateUrl: "partials/VRStart.html", 
    })
    .when("/VRView", { 
        controller: "PageCtrl",
        templateUrl: "partials/VRView.html", 
    })
    .when("/LocationCreation", { 
        controller: "PageCtrl",
        templateUrl: "partials/LocationCreation.html", 
    })
    ;
    // else 404
    // .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
    // this doesn't work with the current express routing implementation ~
}]);

// Main controller
// Independent files ?
// will be an interesting mess on the meantime
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  // (y)
  console.log("Page Controller reporting for duty");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

// Room creation 
app.controller('formCtrl', function ($scope) {

  console.log("formCtrl reporting for duty");

  $scope.building = '01';
  $scope.floor = '01';
  $scope.room = '01';
  $scope.submit = function () {
    // TBD
  };
  $scope.submit();
});