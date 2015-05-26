/**
 * Service for providing the back-end index of available images.
 */
require('../photoapp')
.service('photoIndex', ['$http', function($http) {
  var self = this;
  self.index = null;
  self.path = '/img/images.json';
  $http({
    method: 'GET',
    url: self.path
  }).success(function(data) {
    self.index = data;
  }).error(function() {
    console.log("Couldn't load", self.path);
  });
}]);
