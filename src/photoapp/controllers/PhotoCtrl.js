/**
 * Main controller for the gallery
 */
require('../services/photoIndex');
require('../photoapp')
.controller('PhotoCtrl', ['$window', '$scope', 'photoIndex', function($window, $scope, photoIndex) {
  var self = this;
  self.data = null; // Index data acquired from the backend
  self.photos = []; // Filenames
  self.sizing = {
    step: 0, // Size step from user input slider
    containerSize: 0 // Pixel size for cards in the gallery
  };

  // React to loading of index
  $scope.$watch(function() { return photoIndex.index; },
    function (newVal) {
      self.data = newVal;
      self.updatePhotos();
    });

  // Images should fit nicely when the browser is resized
  angular.element($window).bind('resize', function() {
    self.updateSize();
    self.updatePhotos();
    $scope.$apply(); // required for external events
  });

  // Update the container size based on the window and size step
  self.updateSize = function() {
    var columns = Math.max(1, 6 - Number(self.sizing.step));
    self.sizing.containerSize = $window.innerWidth / columns;
  };
  self.updateSize(); // Call once so width/height aren't 0

  // Event handler for the slider
  self.inputSize = function() {
    self.updateSize();
    self.updatePhotos();
  };

  // Update the array of photo filenames based on current sizing and data
  self.updatePhotos = function() {
    if(self.data) {
      // Determine what size of file to use
      var containerSize = self.sizing.containerSize;
      var sizes = self.data.sizes ? self.data.sizes.slice() : [];
      sizes.sort(function(a,b){ return a - b; });
      var imageSize = sizes[0] || 200;
      for(var j = 0; j < sizes.length && imageSize < containerSize; j++) {
        imageSize = sizes[j];
      }
      // Regenerate the photos array without recreating it or unnecessary deletion
      self.photos.length = self.data.index.length;
      for(var i = 0; i < self.data.index.length; i++) {
        var fileInfo = self.data.index[i];
        var filename = "img/" + fileInfo.basename + "_" + imageSize + fileInfo.ext;
        self.photos[i] = filename;
      }
    }
  };
}]);
