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

            let type;
            scope["severful"] = {}
            let size = Object.keys(event.target.files).length
            console.log(event.target.files)

            for (var i = 0; i < size; i++) {
              type = event.target.files[i].type;
              scope.severful[i] = new Blob([event.target.files[i]], {type: type});
            }

            console.log(scope)
            console.log(scope.severful)
            // scope["severful"] = {...images};
          });
        });
      }
    }
  }])
  ;