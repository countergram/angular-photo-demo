describe('photoIndex', function() {
  var dummyImages = {
    sizes: [100, 200, 300],
    index: [{
      basename: 'somefile',
      ext: '.jpg',
      tags: []
    }]
  };

  beforeEach(function() {
    angular.mock.module('photoapp');
    require('../src/photoapp/services/photoIndex.js');
  });

  it('fetches the image index', inject(function(photoIndex, $httpBackend) {
    $httpBackend.whenGET('/img/images.json').respond(dummyImages);
    $httpBackend.flush();
    expect(photoIndex.index).toEqual(dummyImages);
  }));

  it('leaves the index null on http error', inject(function(photoIndex, $httpBackend) {
    $httpBackend.whenGET('/img/images.json').respond(500);
    $httpBackend.flush();
    expect(photoIndex.index).toBeNull();
  }));
});
