const path = require("path");
module.exports = {
    entry: {
        site: "./src/site.ts",
        mql: "./src/mql.ts"
    },
    output: {
        path: path.resolve(__dirname, "package/js"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: "ts-loader", options: {logLevel: "error"}},
            {test: /\.html$/, loader: "html-loader"}
        ]
    },
    externals: {
        "jquery": "$",
        "parsleyjs": "window.Parsley",
        "autolinker": "window.Autolinker",
        "highcharts": "window.Highcharts",
        "devbridge-autocomplete": "$.devbridgeAutocomplete",
        "flot": "$.plot",
        "highlight.js": "hljs",
        "mustache": "Mustache"
    }
};
