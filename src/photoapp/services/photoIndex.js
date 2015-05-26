/**
 * Service for providing the back-end index of available images.
 */
require('../photoapp')
.service('photoIndex', ['$http', function($http) {
  var self = this;
  self.index = null;
  // This is a relative path because at least Firefox can load requests from
  // local files without an HTTP server, within the same directory, which is
  // good for testing.
  self.path = 'img/images.json';
  $http({
    method: 'GET',
    url: self.path
  }).success(function(data) {
    self.index = data;
  }).error(function() {
    console.log("Couldn't load", self.path);
  });
}]);
