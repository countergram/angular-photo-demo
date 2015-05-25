module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');
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
        sizes: [150, 300, 700, 1100]
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
    less: {
      build: {
        options: {
          paths: ['src', 'bower_components'],
        },
        files: {
          'dist/main.css': 'src/main.less'
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'dist/main.css': ['dist/main.css']
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
    'browserify',
    'less',
    'cssmin'
  ]);
};
