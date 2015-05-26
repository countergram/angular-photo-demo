// Stub to inject into controller
angular.module('mock.photoapp', []).service('photoIndex', function() {});

describe('PhotoCtrl', function() {
  var theWidth = 900;
  var controller;
  var dummyImages = {
    sizes: [100, 200, 300],
    index: [{
      basename: 'somefile',
      ext: '.jpg',
      tags: []
    }]
  };

  // Mock global ($window) properties
  beforeEach(angular.mock.module(function($provide) {
    $provide.decorator('$window', function($delegate) {
      $delegate.innerWidth = theWidth;
      return $delegate;
    });
  }));

  beforeEach(function() { require('../src/photoapp/controllers/PhotoCtrl.js'); });
  beforeEach(angular.mock.module('mock.photoapp'));
  beforeEach(angular.mock.module('photoapp'));

  // Create a controller with a mocked back end service
  beforeEach(inject(function($rootScope, $controller, photoIndex) {
    controller = $controller('PhotoCtrl', {
      $scope: $rootScope.$new(),
      photoIndex: photoIndex
    });
  }));

  it('sets card size to window width with one column', function() {
    controller.sizing.step = 5; // largest step
    controller.updateSize(); // would be called when slider updates
    expect(controller.sizing.containerSize).toEqual(theWidth);
  });

  it('creates a photos array from sample data with a correct filename', function() {
    controller.data = dummyImages;
    controller.sizing.containerSize = 100;
    controller.updatePhotos();
    expect(controller.photos).toEqual(['img/somefile_100.jpg']);
  });

  it('uses larger available images for a larger window', function() {
    controller.data = dummyImages;
    controller.sizing.containerSize = 150;
    controller.updatePhotos();
    expect(controller.photos).toEqual(['img/somefile_200.jpg']);
  });

  it('handles a very large window by using the largest available photos', function() {
    controller.data = dummyImages;
    controller.sizing.containerSize = 1000;
    controller.updatePhotos();
    expect(controller.photos).toEqual(['img/somefile_300.jpg']);
  });
});
