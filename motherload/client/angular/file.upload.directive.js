angular
  .module('app')
  .directive("severful", [() => {
    return {
      scope: {
        "severful": "="
      },
      link: (scope, element, attributes) => {
        element.bind("change", (event) => {
          scope.$apply(() => {
            // NOT CLEANING THIS

            // scope["severful"] = {}
            let size = Object.keys(event.target.files).length
            scope["severful"] = []
            
            // scope.severful = event.target.files

            for (var i = 0; i < size; i++) {
              // scope.severful[i] = new Blob([event.target.files[i]], {type: type});
              // scope.severful[i] = event.target.files[i]
              scope.severful.push(event.target.files[i])
            }

            // console.log(scope)
            // console.log(scope.severful)
            // scope["severful"] = {...images};
          });
        });
      }
    }
  }])
  ;