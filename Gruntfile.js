module.exports = function(grunt) {
  'use strict';
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        files: [{
          dot: true,
          src: ['dist/*', '!dist/.git*', '!dist/img']
        }]
      },
      images: {
        files: [{
          dot: true,
          src: ['dist/img/*']
        }]
      }
    },
    // Custom task
    images: {
      build: {
        src: 'imgsrc/*',
        dest: 'dist/img',
        sizes: [200, 500, 800]
      }
    },
    // Move static index.html
    copy: {
      build: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
      angular: {
        src: 'node_modules/angular/angular.js',
        dest: 'dist/angular.js'
      }
    },
    // Concat javascript based on requires
    browserify: {
      build: {
        files: {
          'dist/main.js': ['src/main.js']
        }
      }
    },
    watch: {
      build: {
        files: ['src/*'],
        tasks: ['default'],
        options: {spawn: false}
      }
    }
  });

  grunt.registerTask('default', [
    'clean:build',
    'copy',
    'browserify'
  ]);

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
      (function processFile(err) {
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
      })();
    });
  });
};
