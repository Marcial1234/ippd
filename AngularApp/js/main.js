/**
 * Modified code from: AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
      .when("/ImageUploadStart", { templateUrl: "partials/ImageUploadStart.html", controller: "PageCtrl" })
      .when("/ImageUploadEdits", { templateUrl: "partials/ImageUploadEdits.html", controller: "PageCtrl" })
    .when("/VRStart", { templateUrl: "partials/VRStart.html", controller: "PageCtrl" })
      .when("/VRView", { templateUrl: "partials/VRView.html", controller: "PageCtrl" })
      .when("/LocationCreation", { templateUrl: "partials/LocationCreation.html", controller: "PageCtrl" })
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

/**
 * Form script
 */
app.controller('formCtrl', function ($scope) {
    $scope.building = '01';
    $scope.floor = '01';
    $scope.room = '01';
    $scope.submit = function () {
        //idk
    };
    $scope.submit();
});