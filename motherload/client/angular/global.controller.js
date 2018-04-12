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
        // add currently building or SOMETHING ELSE ~ idk why but sure

        let formdata = new FormData()
        // have a building prepared when file uploads work ~
        // then pass the ref of that ?
        formdata.append("bldg", "no")
        formdata.append("floor", "?")

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