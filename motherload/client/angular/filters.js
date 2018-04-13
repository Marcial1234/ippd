// File with custom filters

// Template:
// angular
//   .module('app')
//   .filter([filter name to-be used in front-end], function() {
//   return function(data, arg1, ...) {
//     return data;
//   }
// });

// Remove chosen rooms from other options, 'unique selection'
angular 
  .module('app')
  .filter('notTakenInTable', function() {
    // table, selected
  return function(options, scope, x, y) {

    options = options.slice();

    let table = scope.table;
    let selected = scope.table[x][y];

    // console.log(options);    
    let item, found;
    let width = table[0].length;
    let height = table.length;

    // reverse loop, preserves index positions
    for (let index = height - 1 ; index > -1 ; index--) {
      for (let jindex = width - 1 ; jindex > -1 ; jindex--) {
        item = table[index][jindex];

        // take already chosen values out
        if (item != selected) {
          foundIndex = options.indexOf(item);
          if (foundIndex > -1)
            options.splice(foundIndex, 1);
        }

        // // record indices of first room if this is it
        // if (selected != null && scope.startRoom == selected) {
        //   scope.startRoomCoors = {x: x, y: y};
        //   // console.log(scope.startRoomCoors);
        // }
      }
    }

    return options;
  }
});
