var _ = require("underscore");
var Q = require("q");
var STORE = require("store");
var IR = require("../investflow-rest");

function list() {
    var listing = STORE.get("listing");
    if (_.isUndefined(listing) || !_.isArray(listing)) {
        return IR.listAccounts().then(function (listing) {
            STORE.set("listing", listing);
            return Q(listing);
        });
    }
    return Q(listing);
}

function reset() {

}

module.exports = {
    list: list,
    reset: reset
};
