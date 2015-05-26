module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // clean and clean:images are separate because images take longer to generate.
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
    jshint: {
      build: ['Gruntfile.js', 'src/**/*.js', 'tasks/**/*.js', 'tests/**/*.js']
    },
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
    browserify: {
      build: {
        files: {
          'dist/main.js': ['src/photoapp/main.js']
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
        files: ['src/**/*'],
        tasks: ['default'],
        options: {spawn: false}
      }
    }
  });
  grunt.registerTask('default', [
    'clean:build',
    'jshint',
    'copy',
    'browserify',
    'less',
    'cssmin'
  ]);
};
