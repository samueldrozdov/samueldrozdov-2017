var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/styles.scss')
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
      }))
      .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(gulpIf('main.js',rename({suffix: '.min'})))
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist/'))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/**.+(png|jpg|gif|svg)')
    .pipe(imagemin({
      interlaced: false
    }))
    .pipe(gulp.dest('dist/images/'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'))
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
  return runSequence('clean', 'sass',
    ['html', 'js', 'images', 'fonts'],
    cb);
});

gulp.task('watch', function() {
  var reload = browserSync.reload;
  gulp.watch('app/scss/**/*.scss', ['sass'], reload);
  gulp.watch('app/*.html', ['html'], reload);
  gulp.watch('app/js/**/*.js', ['js'], reload);
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

