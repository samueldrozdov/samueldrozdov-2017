var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minifies JS files
    .pipe(gulpIf('*.css', cssnano())) // Minifies CSS files
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/**.+(png|jpg|gif|svg)')
    .pipe(imagemin({
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Clean Tasks
//

gulp.task('clean:dist', function() {
  return del.sync('dist')
});

gulp.task('clean', ['clean:dist']);

// Build Tasks
//

gulp.task('build', function(cb) {
  console.log('Building files')
  return runSequence('clean',
    ['sass', 'useref', 'images', 'fonts'],
    cb);
});

gulp.task('watch', function() {
  var reload = browserSync.reload;
  gulp.watch('app/scss/**/*.scss', ['sass'], ['useref'], reload);
  gulp.watch('app/*.html', ['useref'], reload);
  gulp.watch('app/js/**/*.js', ['useref'], reload);
});

gulp.task('serve', ['build'], function() {
  browserSync.init(['dist/**/*'], {
    server: {
      baseDir: 'dist',
    },
    ghostMode: { // Mirrors input across all devices
      clicks: false,
      forms: false,
      scroll: false,
    },
  });

  gulp.start('watch');
});

