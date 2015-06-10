// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp     = require('gulp'),
$        = require('gulp-load-plugins')(),
rimraf   = require('rimraf'),
sequence = require('run-sequence'),
package  = require('./package.json'),
local = {
  'buildDir': './build/'
};

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  // These files are for your theme's JavaScript
  // These scripts will be included by default on every page in your site
  javascript: [
    './src/*.js'
  ]
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf(local.buildDir, cb);
});

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'));
});

// Compiles and copies the Foundation & Modernizr JavaScripts
// Keep this small as these will be loaded in the head of your HTML document
gulp.task('uglify', ['lint'], function(cb) {

  // Your JavaScript
  // This will be loaded just below the end of the HTML document on every page in your theme
  // Script size is less of an issue than in the head, especially with good caching
  gulp.src(paths.javascript)
  .pipe($.plumber({ //hide errors as lint will deal with them in a much more friendly way
    errorHandler: function (err) {
      //console.log(err);
      this.emit('end');
    }
  }))
  .pipe($.uglify())
  .pipe($.concat(package.name + '.js'))
  .pipe(gulp.dest(local.buildDir))
  ;

  cb();
});

// Builds your entire app once
gulp.task('build', function(cb) {
  sequence('clean', 'uglify', function() {
    console.log("Successfully built.");
    cb();
  });
});

// Default task: builds your app, and recompiles assets when they change
gulp.task('default', function () {
  $.livereload.listen();

  // Build
  sequence('build');

  // Watch JavaScript
  gulp.watch(['./src/**/*'], ['uglify']);

});
