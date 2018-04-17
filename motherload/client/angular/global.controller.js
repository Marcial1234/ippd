
angular
  .module('app')
  .controller('GlobalCtrl', ["$rootScope", "$scope", "$location", "$interval", "Factory",
    function (rootScope, scope, location, interval, Factory, ) {

      // ACCESS ROOT VARIABLES HERE
      // OR ROUTE-TO-ROUTE COMMUNICATIONS
      rootScope.states = {}
      rootScope.search = ""
      rootScope.currentBldgId = ""
      rootScope.currentFloorId = ""
      rootScope.tba = () => alert("functionality TBDone")

      Factory.getStates()
      .then(
        (res) => {
          let keys = Object.keys(res.data);

          for (let i = 0; i < keys.length ; i++ ) {
            // [what appears on the select dropdown] : [value to db]
            scope.states[([res.data[keys[i]], keys[i]].join(" - "))] = keys[i]
          }
        }
      );

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
        formdata.append("bldg", rootScope.currentBldgId)

        // for edit layout: add the new stuff to the db ~ then set this 'rootScope.currentFloorId'
        formdata.append("floor", rootScope.currentFloorId)

        Factory.postPics(scope.names, scope.names.length)
        .then( async (res) => {
          // asynchorously return file paths and let angular know a change happened
          await timeout(3000)
          rootScope.pics = res
          rootScope.$apply()
        })
        
        // resetting
        scope.data = null
        location.path("/FloorMap")
      }

      scope.setBldg = (id, floors) => {
        rootScope.currentBldgId = id
        scope.bldgFloors = floors.slice()
        console.log(id)
        // console.log(id, scope.bldgFloors)
      }

      scope.setFloor = (id) => {
        rootScope.currentFloorId = id
        console.log(id)
      }

      // tested?
      scope.newBuilding = (obj) => {
        // console.log(obj)

        let a = Factory.createBuilding(obj)
        console.log(a)
        a.then(
          (res) => {
            console.log(res)
            if (res.data) {
              // rootScope.allBuildings.push(res.data);
              location.path("/")
              // rootScope.$apply()
            }
            else
              console.log(res);
          } 
        );
      };

    }]
  )
  ;