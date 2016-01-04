import store from "store";
import IR  from "./investflow-rest";

function list():Promise {
    var listing = store.get("listing");
    if (listing == undefined || !Array.isArray(listing)) {
        return IR.listAccounts().then(function (listing) {
            store.set("listing", listing);
            return listing;
        });
    }
    return new Promise.resolve(listing);
}

function reset() {

}
const AccountListing = {
    list: list,
    reset: reset
};

export {
    AccountListing
}


