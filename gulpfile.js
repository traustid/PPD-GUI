// Dependencies
// -------------------------
var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less')
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var rename = require('gulp-rename');
var del = require('del');
var gulpuglify = require('gulp-uglify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var sourcemaps  = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');

// Tasks
// -------------------------

// Only uglify if not in development
var uglify = function() {
  return gulpif(true, gulpuglify());
}

// Build tasks
gulp.task('browserify', function() {

  return browserify('./scripts/main.js', {debug: true})
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
//    .pipe(uglify())
    .pipe(gulp.dest('./www/js'));
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('./build/bundle.css')
	.pipe(minifyCSS())
	.pipe(rename('app.min.css'))
	.pipe(gulp.dest('./www/css'))
});

// Style tasks
gulp.task('styles', function() {
  return gulp.src('./www/css/style.less')
	.pipe(less())
	.pipe(prefix({ cascade: true }))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('./www/css'))
});

// Clean tasks
gulp.task('clean', ['cleanbuild'], function(done) {
  del(['./scr/js', './www/css'], done)
});

gulp.task('cleanbuild', function(done) {
  del(['./build'], done)
});

// commands
gulp.task('build', ['clean'], function(done) {
  return runSequence('browserify', 'minify', 'cleanbuild', done);
});

gulp.task('watch', function(done){
  return runSequence('build', function() {
	gulp.watch('./scripts/**/*.js', ['build']);
	gulp.watch('./scr/templates/*.hbs', ['build']);
	gulp.watch('./www/css/*.less', ['build']);
	done()
  })
});

gulp.task('dev', ['watch'], function() {
  nodemon({
	script: 'server.js',
	delay: 2500
  })
});


gulp.task('watch', function() {
	gulp.watch('./scripts/**/*.js', ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);

