var gulp = require("gulp");
var eslint = require("gulp-eslint");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var shim = require("browserify-shim");
var babelify = require("babelify");

gulp.task("eslint", function () {
    return gulp.src(["./src/**/*.js", "./spec/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task("build", function () {
    return browserify("./src/site.js")
        .transform(babelify)
        .transform(shim)
        .bundle()
        .pipe(source("site.js"))
        .pipe(gulp.dest("./package/js/"))
});

gulp.task("deploy-site-js", ["build"], function () {
    return gulp.src("./package/js/site.js")
        .pipe(gulp.dest("../iflow/src/main/webapp/js/"));
});

gulp.task("default", ["build"]);