/**
 * Service for providing the back-end index of available images.
 */
angular.module('photoapp')
.service('photoIndex', ['$http', function($http) {
  var self = this;
  self.index = null;
  $http({
    method: 'GET',
    url: 'img/images.json'
  }).success(function(data) {
    self.index = data;
  }).error(function() {
    console.log("Couldn't load images.json");
  });
}]);
