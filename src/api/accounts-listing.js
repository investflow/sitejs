import store from "store";
import IR  from "./investflow-rest";

function list():Promise {
    let listing = store.get("listing");
    if (listing == undefined || !Array.isArray(listing)) {
        return IR.listAccounts().then((listing) => {
            store.set("listing", listing);
            return listing;
        });
    }
    return Promise.resolve(listing);
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


