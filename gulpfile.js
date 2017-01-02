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
var handlebars = require('gulp-compile-handlebars')
var layouts = require('handlebars-layouts');

handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));

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

gulp.task('templates', function() {
  var templateData = {}
  var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ['app/partials/'],
    // helpers: {
    //   capitals: function(str) {
    //     return str.toUpperCase();
    //   },
    // },
  };

  return gulp.src('app/templates/**/*.hbs')
    .pipe(handlebars(templateData, options))
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('dist'));
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
    ['js', 'images', 'fonts'], 'templates',
    cb);
});

gulp.task('watch', function() {
  var reload = browserSync.reload;
  gulp.watch(['app/templates/**/*.hbs', 'app/partials/**/*.hbs'], ['templates'], reload);
  gulp.watch('app/scss/**/*.scss', ['sass'], reload);
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

