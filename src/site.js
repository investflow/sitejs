var exports = {};

exports.AddAccountFormApp = require("./app/AddAccountFormApp");
exports.DOMUtils = require("./api/dom-utils");
exports.Titles = require("./api/titles");

exports.Parsley = require("parsleyjs");
require("./api/parsley-translations");

window.$site = exports;

