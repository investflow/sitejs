// Karma configuration
// Generated on Sun Dec 27 2015 17:50:21 GMT-0800 (PST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        frameworks: ["jasmine-jquery", "jasmine"],

        // list of files / patterns to load in the browser
        files: [
            "node_modules/jquery/dist/jquery.js",
            "package/js/site.js",
            "package/js/test.js"
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress"],

        // web server port
        port: 9876,

        logLevel: "LOG_DEBUG",

        // Start these browsers. Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["PhantomJS"],

        // Continuous Integration mode. Ff true, Karma captures browsers, runs the tests and exits.
        singleRun: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Concurrency level: how many browser should be started simultaneous
        concurrency: Infinity
    });
};
