import $ from "jquery"
import {Account, getCachedAccountsListing} from "../../api/accounts-listing"

const MAX_SUGGESTIONS = 10;
export default {
    attach: (selector:string):void => {
        //noinspection JSUnusedGlobalSymbols
        $(selector).devbridgeAutocomplete({
            lookup: (query, done) => {
                getCachedAccountsListing().then((accounts:Array<Account>) => {
                    let lcQuery = query.toLowerCase();
                    let result = {suggestions: []};
                    for (let i = 0; i < accounts.length && result.suggestions.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (account.account.toLocaleLowerCase().indexOf(lcQuery) >= 0 || account.name.toLocaleLowerCase().indexOf(lcQuery) >= 0) {
                            let nameString = account.name + "/" + account.account;
                            let typeName = account.isAlpariIndex() ? ", портфель" : account.isAlpariFund() ? ", фонд" : "";
                            let closedTxt = account.open ? "" : ", закрыт";
                            let detailedString = nameString + " (" + account.broker.name + typeName + closedTxt + ")";
                            result.suggestions.push({
                                value: detailedString,
                                data: {category: account.broker.id == 4 ? undefined : "--- закрытые счета ---"}
                            });
                        }
                    }
                    done(result);
                });
            },
            groupBy: "category",
            formatResult: (suggestion:Object):string => {
                return suggestion.value;
            },
            onSelect: (suggestion) => {
                alert("You selected: " + suggestion.value + ", " + suggestion.data);
            }
        });
    }
}