var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var shim = require('browserify-shim');
var partialify = require('partialify');
var babelify = require('babelify');
var babelConfig = {presets: ["es2015"]};

gulp.task('lint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', function () {
    return browserify('./src/site.js')
        .transform(babelify, babelConfig)
        .transform(partialify)
        .transform(shim, {global: true})
        .bundle()
        .pipe(source('site.js'))
        .pipe(gulp.dest('./package/js/'));
});

gulp.task('deploy-site-js', function () {
    return browserify('./src/site.js')
        .transform(babelify, babelConfig)
        .transform(partialify)
        .transform(shim, {global: true})
        .bundle()
        .pipe(source('site.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('../iflow/src/main/webapp/js/'));
});


gulp.task('watch', function () {
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['build']);