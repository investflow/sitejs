var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var jasmine = require('gulp-jasmine');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var partialify = require('partialify');

gulp.task('connect', function () {
    connect.server({
        root: 'package',
        port: 5000
    })
});

gulp.task('build', function () {
    return browserify('./src/site.js')
        .transform(partialify)
        .transform('browserify-shim', {global: true})
        .bundle()
        .pipe(source('site.js'))
        .pipe(gulp.dest('./package/js/'));
});

gulp.task('deploy-site-js', function () {
    return browserify('./src/site.js')
        .transform(partialify)
        .transform('browserify-shim', {global: true})
        .bundle()
        .pipe(source('site.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('../iflow/src/main/webapp/js/'));
});

gulp.task('test', function () {
    return gulp.src('src/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('watch', function () {
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['connect', 'watch']);