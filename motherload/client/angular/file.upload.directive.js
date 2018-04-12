angular
  .module('app')
  .directive("severful", [() => {
    return {
      scope: {
        "names": "=",
        "severful": "=",
      },
      link: (scope, element, attributes) => {

        linkFilesToAngular = (event) => {
          scope.names = []
          scope.severful = new FormData()
          let item, size = Object.keys(event.target.files).length + 1

          for (var i = 0; i < size; i++) {
            item = event.target.files[i]
            
            if (item) {
              scope.names.push(item.name)
              scope.severful.append(i, item)
            }
          }

          scope.$apply()
        }

        element.bind("change", (event) => {
          linkFilesToAngular(event)
        });

        // makeDropable = (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   element.classList.remove("dragover");
        //   linkFilesToAngular(e)
        // }

        // element.bind("drop", makeDropable);
        // element.bind("dragleave", makeDropable);

        // element.bind("dragover", function(e) {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   element.classList.add("dragover");
        // });
      }
    }
  }])
  ;