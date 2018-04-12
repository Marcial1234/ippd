// Later use ~
angular
  .module('app')
  .controller('GlobalCtrl', ["$rootScope", "$scope", "$location", "Factory",
    function (rootScope, scope, location, Factory, ) {

      // CAN ONLY ACCESS ROOT VARIABLES HERE
      // scope.search = "";

      scope.showUploadWindow = () => $('#up').trigger('click')
      
      scope.dale = () => {
        let formdata = scope.data

        // have a building prepared when file uploads work ~
        // then pass the ref of that ?
        formdata.append("bldg", "no")
        formdata.append("floor", Date.now())
        formdata.append("room", "?")

        Factory.postPics(formdata, scope.names.length)
        .then((res) => {
          console.log(res)
        })
      }

      // tested?
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