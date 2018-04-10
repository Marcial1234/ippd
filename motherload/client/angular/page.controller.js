// Main controller
angular
  .module('app')
  .controller('PageCtrl', ["$scope", "$location", "Factory",
    function (scope, location, Factory) {

      // pass picture data as a state param ~
      // or as parent controller var?

      // Dynamically create a 2D array
      scope.createMatrix = (x, y) => {
        return Array(x).fill(0).map(x => Array(y).fill(null))
      }

      // Initial variables of the contiguous 'room'
      scope.x = 5, scope.y = 5 // dimensions
      scope.table = scope.createMatrix(scope.x, scope.y)
      scope.startRoom, scope.startRoomCoors = {}

      // extra f(x)s
      // scope.getDefaultDropdownText = (counter) => {
      //   return counter > 0 ? "Picture: " : "Done!"
      // }

      function isWithinBounds(x, y) {
        return -1 < x && x < scope.x && -1 < y && y < scope.y
      }

      // provide a way to preserve data and increment the table ~
      // table offset f(x)nality
      function shift(increment_x, increment_y) {
        // console.log(increment_x, increment_y)

        let tempTable = scope.createMatrix(scope.x, scope.y)
        let shifted_x, shifted_y

        for (let i = 0; i < scope.x; i++) {
          for (let j = 0; j < scope.y; j++) {
            shifted_x = i + increment_x
            shifted_y = j + increment_y

            // make callback variable?? hmm
            // within bounds...
            if (isWithinBounds(shifted_x, shifted_y))
              tempTable[i][j] = scope.table[shifted_x][shifted_y]
            else {
              tempTable[i][j] = null
            }
          }
        }

        scope.table = tempTable
      }

      scope.shiftUp = () => shift(1,0)
      scope.shiftDown = () => shift(-1,0)
      scope.shiftLeft = () => shift(0,1)
      scope.shiftRight = () => shift(0,-1)

      // === BUILD PHOTO OBJ CODE ===
      let increments = [[-1,0], [1,0], [0, 1], [0, -1]]

      let incrementsStringsToNavRots = {
        // "0-1" => left -90
        // "01" => right -178
        // "-10" => forward 0
        // "10" => backward 90
        "-10": 0,
        "01": -90,
        "0-1": 90,
        "10": -178,
      }

      function incrementsToNavRots(x, y) {
        let incrementSting = [x, y].join("")
        console.log(incrementSting)
        return incrementsStringsToNavRots[incrementSting]
      }

      function newnav(rotation, index) {
        return {
          text: "Next",
          rotationY: rotation,
          linkedPhotoId: index,
        }
      }

      function processNavs(x, y) {
        let navs = []
        let increment_x, increment_y
        let item, shifted_x, shifted_y

        for (let i = 0; i < increments.length; i++) {
          [increment_x, increment_y] = increments[i]
          shifted_x = x + increment_x
          shifted_y = y + increment_y

          if (isWithinBounds(shifted_x, shifted_y)) {
            item = scope.table[shifted_x][shifted_y]
            
            if (item != null) {
              index = scope.photoToIndex[item]
              rot = incrementsToNavRots(increment_x, increment_y)
              navs.push(newnav(rot, index))
            }
          }
        }

        // console.log("navsss", navs)
        return navs
      }

      function processPhoto(obj) {
        let rot, currentValue
        let {x, y} = obj
        let photo = {}

        currentValue = scope.table[x][y]
        photo["uri"] = scope.picsToUrls[currentValue]
        photo["navs"] = processNavs(x, y)

        // console.log("photoss", photo)
        return photo
      }

      function buildPhotoObj() {
        let tempPhotos = []
        let indices = Object.keys(scope.photoToIndex)
        let size = indices.length

        // actually generate objs
        for (let i = 0; i < size; i++) {
          tempPhotos.push(processPhoto(scope.photoToCoors[indices[i]]))
        }

        return tempPhotos
      }

      // preprocess table to generate maps to indices and coordinates
      function preProcess() {
        let item
        scope.photoToIndex = {}
        scope.photoToCoors = {}

        for (let i = 0; i < scope.x; i++) {
          for (let j = 0; j < scope.y; j++) {
            item = scope.table[i][j]

            // ignores 0s if only 'truthy'
            if (item != null) {
              scope.photoToIndex[item] = Object.keys(scope.photoToIndex).length
              scope.photoToCoors[item] = {x: i, y: j}
            }
          }
        }
        // all needed maps generated now ~
        // console.log(scope.photoToIndex)
        // console.log(scope.photoToCoors)
      }

      // built: navs => photos => floor
      // but called in reverse ~ ofc
      scope.buildFloor = () => {

        if (!scope.startRoom) {
          alert("Select a start room before continuing")
          return
        }

        preProcess()

        let data = {
          photos: buildPhotoObj(),
          // parent: buldPhotoObj(),
          firstPhotoId: scope.photoToIndex[scope.startRoom],
        }

        console.log(JSON.stringify(data))
        scope.vid = JSON.stringify(data)
        // make a post ~ done
      }
      // === END ===

      // Replace this with pano data ~
      // create x random rumbers up to x^2
      scope.picsToUrls = {0: "url-1"}
      scope.picsOptions = [0]
      let val

      for (let i = 0; i < 7; i++) {
        val = Math.floor(Math.random() * (scope.x ** 3))
        scope.picsOptions.push(val)
        scope.picsToUrls[val] = "url" + i
      }

		}
  ])
	