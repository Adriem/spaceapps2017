var gulp = require('gulp')
var del = require('del')
var concat = require('gulp-concat')
var cssmin = require('gulp-clean-css')
var htmlmin = require('gulp-htmlmin')
var sass = require('gulp-sass')
var maps = require('gulp-sourcemaps')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var util = require('gulp-util')
var npmFiles = require('gulp-npm-files')

// CLEAN TASKS

gulp.task('clean', function (next) {
  return del([__dirname + '/dist/**/*'], next)
})

// BUILD TASKS

gulp.task('build:img', function () {
  return gulp.src(__dirname + '/src/img/**/*')
             .pipe(gulp.dest(__dirname + '/dist/img/'))
})

gulp.task('build:css', function () {
  return gulp.src(__dirname + '/src/**/*.css')
             .pipe(maps.init())
             .pipe(concat('app.css').on('error', util.log))
             .pipe(cssmin())
             .pipe(rename({ extname: '.min.css' }))
             .pipe(gulp.dest(__dirname + '/dist/'))
})

gulp.task('build:scss', function () {
  return gulp.src(__dirname + '/src/main.scss')
             .pipe(maps.init())
             .pipe(sass().on('error', sass.logError))
             .pipe(cssmin())
             .pipe(rename({
               dirname: '.',
               extname: '.min.css',
               basename: 'app'
             }))
             .pipe(gulp.dest(__dirname + '/dist/'))
})

gulp.task('build:js', function (next) {
  return gulp.src([__dirname + '/src/app.js', __dirname + '/src/**/*.js'])
             .pipe(maps.init())
             .pipe(uglify({ mangle: false }).on('error', util.log))
             .pipe(concat('app.js').on('error', util.log))
             .pipe(rename({ extname: '.min.js' }))
             .pipe(maps.write())
             .pipe(gulp.dest(__dirname + '/dist/'))
})

gulp.task('build:html', function () {
  return gulp.src(__dirname + '/src/**/*.html')
             .pipe(htmlmin({
               removeComments: true,
               collapseWhitespace: true
             }).on('error', util.log))
             .pipe(rename({ dirname: '.' }))
             .pipe(gulp.dest(__dirname + '/dist/'))
})

gulp.task('build:vendor', function () {
  return gulp.src(npmFiles(), { base: __dirname })
             .pipe(gulp.dest(__dirname + '/dist/'))
})

gulp.task('build', ['build:html', 'build:scss', 'build:js', 'build:img', 'build:vendor'])

// WATCH TASKS

gulp.task('watch:img', ['build'], function () {
  return gulp.watch(__dirname + '/src/img/**/*', ['build:img'])
})

gulp.task('watch:js', ['build'], function () {
  return gulp.watch(__dirname + '/src/**/*.js', ['build:js'])
})

gulp.task('watch:css', ['build'], function () {
  return gulp.watch(__dirname + '/src/**/*.css', ['build:css'])
})

gulp.task('watch:scss', ['build'], function () {
  return gulp.watch(__dirname + '/src/**/*.scss', ['build:scss'])
})

gulp.task('watch:html', ['build'], function () {
  return gulp.watch(__dirname + '/src/**/*.html', ['build:html'])
})

gulp.task('watch:dependencies', ['build'], function() {
  return gulp.watch(__dirname + '/package.json', ['build:vendor'])
})

gulp.task('watch', ['watch:html', 'watch:scss', 'watch:js', 'watch:img', 'watch:dependencies'])

