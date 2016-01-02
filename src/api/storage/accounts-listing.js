import _ from "underscore";
import STORE from "store";
import IR  from "../investflow-rest";
require('es6-promise').polyfill();

function list() {
    var listing = STORE.get("listing");
    if (_.isUndefined(listing) || !_.isArray(listing)) {
        return IR.listAccounts().then(function (listing) {
            STORE.set("listing", listing);
            return listing;
        });
    }
    return new Promise((resolve) => resolve(listing));
}

function reset() {

}

export default {
    list: list,
    reset: reset
};
