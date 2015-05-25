module.exports = function(grunt) {
  grunt.registerMultiTask('images', 'Number and resize images', function() {
    var path = require('path');
    var gm = require('gm');
    var mkdirp = require('mkdirp');
    var sizes = this.data.sizes || [500];
    var done = this.async();

    this.files.forEach(function(fileSpec) {
      grunt.file.mkdir(fileSpec.dest);

      // a job list
      var inFiles = [];
      // this will become a static json file
      var index = [];
      var forJson = {index: index, sizes: sizes};

      fileSpec.src.forEach(function(file, fileNo) {
        var parts = path.parse(file);
        for(var i = 0; i < sizes.length; i++) {
          inFiles.push({
            file: file,
            fileNo: fileNo,
            size: sizes[i],
            dest: path.join(fileSpec.dest, parts.name + '_' + sizes[i] + parts.ext)
          });
        }
        index.push({
          basename: parts.name,
          ext: parts.ext,
          tags: []
        });
      });

      // Create an index file for the front end to use
      // TODO exclude or mark errors?
      grunt.file.write(path.join(fileSpec.dest, 'images.json'), JSON.stringify(forJson));

      // Func for processing inFiles with itself as the callback
      var i = -1;
      var numErrors = 0;
      var numExisted = 0;
      function processFile(err) {
        if(err) {
          grunt.log.writeln("Error processing " + inFiles[i]);
          numErrors++;
        }
        if(++i < inFiles.length) {
          var job = inFiles[i];
          if(!grunt.file.exists(job.dest)) {
            gm(job.file).resize(job.size, job.size).write(job.dest, processFile);
          } else {
            numExisted++;
            setTimeout(processFile, 0);
          }
        } else {
          var numDone = inFiles.length - numErrors - numExisted;
          grunt.log.writeln(numDone + " images written, " + numErrors + " errors, " + numExisted + " existed.");
          done(true);
        }
      }
      processFile();
      processFile();
    });
  });
};
