angular
  .module('app', [
    'ngRoute',
    'app.routes',
    'ngFileUpload',
  ])
  //  The below makes for nice routes when using '#' based routes
  // .config(['$locationProvider', ($locationProvider) => {
  //   $locationProvider.hashPrefix('');
  // }])
  ;