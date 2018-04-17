// Main controller
angular
  .module('app')
  .controller('MapCtrl', ["$rootScope", "$scope", "$location", "$interval", "Factory",
    function (rootScope, scope, location, interval, Factory, ) {

      // starter code below these 2 f(x)s

      // Dynamically create a 2D array
      scope.createMatrix = (x, y) => {
        return Array(x).fill(0).map(x => Array(y).fill(null))
      }
      
      // 'service' that waits for file data to be done ~ killed after
      const checkFilesDones = () => {
        if (rootScope.pics && scope.loading) {
          scope.loading = false
          console.log(rootScope.pics)

          rootScope.names.forEach((item, index) => {
            // scope.picsOptions.push(index)
            scope.picsToUrls[index] = item
          })

          interval.cancel(waitForFiles)
          delete waitForFiles
        }
        else if (!scope.loading)
          delete waitForFiles
        else
          console.log("Got nonin")
      }

      // starter code
      if (false) {
      // if (!rootScope.currentBldgId) {
        alert("No building refence found. Please browse to this page in a valid sequence")
        console.log(rootScope.currentBldgId)
        location.path("/")
      }
      // we good, then ~
      else {
        // Initial variables of the contiguous 'room'
        scope.x = 5, scope.y = 5 // dimensions
        scope.tableStyle = "centered", scope.startRoom, 
        scope.table = scope.createMatrix(scope.x, scope.y)

        // scope.picsOptions = rootScope.names.map((x,i) => i)
        scope.picsOptions = [0,1,2,3]

        // wait for picture data from parent controller
        let waitForFiles = interval(checkFilesDones, 5000)
        scope.loading = true

        // mapping to picture data TBUsed later
        scope.picsToUrls
      }

      scope.setTableStyling = (size) => {
        scope.tableStyle =  size < 11 ? "centered " : "left"
      }

      // scope.getDefaultDropdownText = (counter) => {
      //   return counter > 0 ? "Picture: " : "Done!"
      // }

      // 2D Array 'Map' => Floor Object logic
      const isWithinBounds = (x, y) => {
        return -1 < x && x < scope.x && -1 < y && y < scope.y
      }

      // provide a way to preserve data and increment the table ~
      // table offset f(x)nality
      const shift = (increment_x, increment_y) => {
        let tempTable = scope.createMatrix(scope.x, scope.y)
        let shifted_x, shifted_y

        for (let i = 0; i < scope.x; i++) {
          for (let j = 0; j < scope.y; j++) {
            shifted_x = i + increment_x
            shifted_y = j + increment_y

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
      const increments = [[-1,0], [1,0], [0, 1], [0, -1]]

      const incrementsStringsToNavRots = {
        // "0-1" => left -90
        // "01" => right -178
        // "-10" => forward 0
        // "10" => backward 90
        "-10": 0,
        "01": -90,
        "0-1": 90,
        "10": -178,
      }

      const incrementsToNavRots = (x, y) => {
        let incrementSting = [x, y].join("")
        // console.log(incrementSting)
        return incrementsStringsToNavRots[incrementSting]
      }

      const newnav = (rotation, index) => {
        return {
          text: "To room " + index,
          rotationY: rotation,
          linkedPhotoId: index,
        }
      }

      const processNavs = (x, y) => {
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

      const processPhoto = (obj) => {
        let rot, currentValue
        let {x, y} = obj
        let photo = {}

        currentValue = scope.table[x][y]
        photo["uri"] = scope.picsToUrls[currentValue]
        photo["navs"] = processNavs(x, y)

        // console.log("photoss", photo)
        return photo
      }

      const buildPhotoObj = () => {
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
      const preProcess = () => {
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

      // build order: navs => photos => floor
      // but called in reverse ofc
      scope.buildFloor = () => {
        if (!scope.startRoom) {
          alert("Select a start room before continuing")
          return
        }

        preProcess()
        const data = {
          photos: buildPhotoObj(),
          parent: rootScope.currentBldgId,
          firstPhotoId: scope.photoToIndex[scope.startRoom],
        }
        console.log(JSON.stringify(data))
        scope.vid = JSON.stringify(data)
        // make a post ~ done
        // Factory.createFloor(data)
      }
      // === END ===
		}
  ])
	