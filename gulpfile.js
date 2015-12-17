var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var partialify = require('partialify');
var uglify = require('gulp-uglify');

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
        .pipe(source('investflow-portfolio.min.js'))// saves it the investflow-portfolio.js file
        .pipe(buffer()) //convert from streaming to buffered vinyl file object. Required by uglify.
        .pipe(uglify())
        .pipe(gulp.dest('./package/js/')); // stores it in ./package/js/ directory
});


gulp.task('watch', function () {
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['connect', 'watch']);