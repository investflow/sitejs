var _ = require("underscore");
var STORE = require("store");
var IR = require("../investflow-rest");

function list() {
    var listing = STORE.get("listing");

    if (_.isUndefined(listing)) {
        listing = IR.listAccounts();
        STORE.set("listing", listing);
    }
    return listing;
}

function reset() {

}

module.exports = {
    list: list,
    reset: reset
};
