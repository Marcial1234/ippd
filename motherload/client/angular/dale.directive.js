angular
  .module('app')
  .directive('ngThumb', ['$window', function($window) {
      var helper = {
          support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      };
  
      return {
          restrict: 'A',
          template: '<canvas/>',
          link: function(scope, element, attributes) {
              if (!helper.support) return;
  
              var params = scope.$eval(attributes.ngThumb);
  
              if (!helper.isImage(params.file)) return;
  
              var canvas = element.find('canvas');
              var reader = new FileReader();
  
              reader.onload = onLoadFile;
              reader.readAsDataURL(params.file);
  
              function onLoadImage() {
                  var width = params.width || this.width / this.height * params.height;
                  var height = params.height || this.height / this.width * params.width;
                  canvas.attr({ width: width, height: height });
                  canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
              }
          }
      };
  }])
  ;