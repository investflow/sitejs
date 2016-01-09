import $ from "jquery"
import {Account, getCachedAccountsListing} from "../../api/accounts-listing"

const MAX_SUGGESTIONS = 10;
export default {
    attach: function (selector:string):void {
        //noinspection JSUnusedGlobalSymbols
        $(selector).devbridgeAutocomplete({
            lookup: function (query, done) {
                getCachedAccountsListing().then((accounts:Array<Account>) => {
                    let lcQuery = query.toLowerCase();
                    let result = {suggestions: []};
                    for (let i = 0; i < accounts.length && result.suggestions.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (account.account.toLocaleLowerCase().indexOf(lcQuery) >= 0 || account.name.toLocaleLowerCase().indexOf(lcQuery) >= 0) {
                            result.suggestions.push({
                                value: account.name + "/" + account.account + " (" + account.broker.name + ")",
                                data: {category: account.broker.id == 4 ? undefined : "-- закрытые счета --"}
                            });
                        }
                    }
                    done(result);
                });
            },
            groupBy: "category",
            onSelect: function (suggestion) {
                alert("You selected: " + suggestion.value + ", " + suggestion.data);
            }
        });
    }
}