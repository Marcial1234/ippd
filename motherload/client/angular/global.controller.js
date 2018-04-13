
angular
  .module('app')
  .controller('GlobalCtrl', ["$rootScope", "$scope", "$location", "$interval", "Factory",
    function (rootScope, scope, location, interval, Factory, ) {

      // ACCESS ROOT VARIABLES HERE
      // OR ROUTE-TO-ROUTE COMMUNICATIONS
      rootScope.search = ""
      rootScope.currentBldgId = ""
      rootScope.currentFloorId = ""
      rootScope.tba = () => alert("functionality TBDone")

      // scope.showUploadWindow = () => $('#up').trigger('click')

      // force waits, EVEN ASYCN ~ copied from server code, although overkill
      const timeout = ms => new Promise(res => setTimeout(res, ms))
      
      // rename ~
      scope.sendImagesToServer = () => {
        rootScope.names = scope.names
        // console.log(rootScope.names)
        let formdata = scope.data

        if (!formdata) {
          alert("Select at least one file")
          return
        }

        // have a building prepared when file uploads work ~
        // then pass the ref of that ?
        formdata.append("bldg", "no")
        formdata.append("floor", Date.now())
        formdata.append("room", "?")

        Factory.postPics(scope.names, scope.names.length)
        .then( async (res) => {
          // asynchorously return file paths and let angular know a change happened
          await timeout(3000)
          rootScope.pics = res
          rootScope.$apply()
        })
        
        location.path("/FloorMap")
      }

      scope.setBldg = (id) => {
        rootScope.currentBldgId = id
        console.log(id)
      }

      scope.setFloor = (id) => {
        rootScope.currentFloorId = id
        console.log(id)
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