'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('bvd_calculator.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      },
    },
    sass: {
        options: {
          includePaths: ['bower_components/foundation/scss'],
        },
        dist: {
          options: {
            //outputStyle: 'compressed', //ideal, but stripping header comment so not currently used
            sourceComments: 'none',
            outputStyle: 'compact'
          },
          files: {
            'src/style.css': 'src/scss/style.scss',
          }        
        }
      },
      copy: {
        dist: {
          files: {
                  'dist/foundation.min.js': 'bower_components/foundation/js/foundation.min.js',
                  'src/foundation.min.js': 'bower_components/foundation/js/foundation.min.js',
                  'src/foundation.js': 'bower_components/foundation/js/foundation.js',
                  'dist/modernizr.js': 'bower_components/modernizr/modernizr.js',
                  'dist/style.css': 'src/style.css',
                  'src/jquery.min.js': 'bower_components/jquery/dist/jquery.min.js',
                  'src/jquery.min.map': 'bower_components/jquery/dist/jquery.min.map',
                  'dist/jquery.min.js': 'src/jquery.min.js',
                  'dist/jquery.min.map': 'src/jquery.min.map',
                  'dist/index.html': 'src/index.html',
          }
      
        }
      },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/jquery.bvd_calculator.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      /*
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      */
      scss: {
    	  files: 'src/scss/*.scss',
          tasks: ['sass']  
      }
    },
  });

  // This provides necessary task plugins.
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  
  // Default task.
  grunt.registerTask('build', ['clean', 'concat', 'sass', 'uglify', 'copy']);
  //grunt.registerTask('build', ['jshint', 'qunit', 'clean', 'concat', 'sass', 'uglify', 'copy']);
  grunt.registerTask('default', ['build', 'watch']);

};
