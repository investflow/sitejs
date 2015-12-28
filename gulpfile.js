var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
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
    return browserify('./src/package.js') // Grabs the package.js file
        .transform(partialify)
        .bundle() // bundles it and creates a file called package.js
        .pipe(source('site.js'))// saves it the investflow-portfolio.js file
        .pipe(gulp.dest('./package/js/')); // stores it in ./package/js/ directory
});

gulp.task('build-min', function () {
    return browserify('./src/package.js') // Grabs the package.js file
        .transform(partialify)
        .bundle() // bundles it and creates a file called package.js
        .pipe(source('site.min.js'))// saves it the investflow-portfolio.js file
        .pipe(buffer()) //convert from streaming to buffered vinyl file object. Required by uglify.
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./package/js/')); // stores it in ./package/js/ directory
});

gulp.task('test', function () {
    return gulp.src('src/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('watch', function () {
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['connect', 'watch']);