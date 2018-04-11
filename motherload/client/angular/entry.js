angular
  .module('app', [
    'ngRoute',
    'app.routes',
    'ngFileUpload',
    'angularFileUpload',
  ])
  //  The below makes for nice routes when using '#' based routes
  // .config(['$locationProvider', ($locationProvider) => {
  //   $locationProvider.hashPrefix('');
  // }])
  ;