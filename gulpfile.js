var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var tsify = require("tsify");
var shim = require("browserify-shim");

gulp.task("build", function () {
    return browserify(["./src/main.ts", "./typings/tsd.d.ts"])
        .plugin(tsify)
        .transform(shim)
        .bundle()
        .pipe(source("site.js"))
        .pipe(gulp.dest("./package/js/"))
});


gulp.task("default", ["build"]);