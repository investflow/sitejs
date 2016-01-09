/*eslint no-var: 0, no-console: 0*/

var gulp = require("gulp");
var eslint = require("gulp-eslint");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var shim = require("browserify-shim");
var babelify = require("babelify");
var karmaServer = require("karma").Server;
var flow = require("flow-bin");
var execFile = require("child_process").execFile;

gulp.task("eslint", function () {
    return gulp.src(["./src/**/*.js", "./spec/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task("build", ["eslint"], function () {
    return browserify("./src/site.js")
        .transform(babelify)
        .transform(shim)
        .bundle()
        .pipe(source("site.js"))
        .pipe(gulp.dest("./package/js/"))
});

gulp.task("typecheck", function () {
    return execFile(flow, ["check"], {cwd: "src"}, function (err, stdout) {
        console.log(stdout);
    });
});


gulp.task("deploy-site-js", ["build"], function () {
    return gulp.src("./package/js/site.js")
        .pipe(gulp.dest("../iflow/src/main/webapp/js/"));
});

gulp.task("test", function (done) {
    new karmaServer({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});


gulp.task("default", ["build"]);