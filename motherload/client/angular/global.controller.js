// Later use ~
angular
  .module('app')
  .controller('GlobalCtrl', ["$rootScope", "$scope", "$location", "Factory", 'FileUploader',
    function (rootScope, scope, location, Factory, FileUploader) {

      // ey!
      // var socket = io.connect(window.location.host);
      // var socket = io();
      
      // let a = new FileUploader({url:"/"});
      // console.log(a);

      scope.dale = () => {
        // send to the server as a post?
        let formdata = new FormData();

        scope.data.forEach((value, key) => {
          formdata.append(key, value);
        })

        Factory.postPics(formdata);
        // .then(
        //   (res) => {
        //     console.log(res);
        //   }
        // )
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