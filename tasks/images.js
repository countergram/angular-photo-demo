module.exports = function(grunt) {
  grunt.registerMultiTask('images', 'Number and resize images', function() {
    var path = require('path');
    var gm = require('gm');
    var async = require('async');
    var sizes = this.data.sizes || [500];
    var done = this.async();

    this.files.forEach(function(fileSpec) {
      grunt.file.mkdir(fileSpec.dest);

      // Job list with functions for all destination images
      var taskFuncs = [];

      // Stats to report afterward
      var numErrors = 0;
      var numExisted = 0;

      // this will become a static json file
      var index = [];
      var forJson = {index: index, sizes: sizes};

      fileSpec.src.forEach(function(file, fileNo) {
        var parts = path.parse(file);
        // The JSON only gets one description of the image, sizes separate
        var imageSpec = {
          basename: parts.name,
          ext: parts.ext,
          tags: []
        };
        index.push(imageSpec);
        // The job list gets an entry for each size
        sizes.forEach(function(size) {
          taskFuncs.push(function(callback) {
            var dest = path.join(fileSpec.dest, parts.name + '_' + size + parts.ext);
            if(grunt.file.exists(dest)) {
              numExisted++;
              callback();
            } else {
              gm(file).resize(size, size).write(dest, function(err) {
                // Log but squelch errors - otherwise processing would halt
                if(err) {
                  numErrors++;
                  grunt.log.writeln('Error processing', file, '->', dest);
                }
                callback();
              });
            }
          });
        });
      });

      async.parallelLimit(taskFuncs, require('os').cpus().length, function() {
        // Create an index file for the front end to use
        // TODO exclude or mark errors?
        grunt.file.write(path.join(fileSpec.dest, 'images.json'), JSON.stringify(forJson));
        // Log summary
        var numDone = taskFuncs.length - numErrors - numExisted;
        grunt.log.writeln(numDone, 'images written,', numErrors, 'errors,', numExisted, 'existed.');
        done(true);
      });
    });
  });
};
