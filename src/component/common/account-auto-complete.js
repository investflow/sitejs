import $ from "jquery"
import {Account, getCachedAccountsListing} from "../../api/accounts-listing"
import log from "loglevel";

const MAX_SUGGESTIONS = 10;
export default {
    attach: (selector:string):void => {
        //noinspection JSUnusedGlobalSymbols
        $(selector).devbridgeAutocomplete({
            lookup: (query, done) => {
                log.trace("AAC: lookup: " + query);
                getCachedAccountsListing().then((accounts:Array<Account>) => {
                    let lcQuery = query.toLowerCase();
                    let accountsToShow = [];

                    let checkAccount = (account, lcQuery):boolean => {
                        return (account.account.toLocaleLowerCase().indexOf(lcQuery) >= 0 || account.name.toLocaleLowerCase().indexOf(lcQuery) >= 0);
                    };

                    // select open accounts first
                    for (let i = 0; i < accounts.length && accountsToShow.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (account.open && checkAccount(account, lcQuery)) {
                            accountsToShow.push(account);
                        }
                    }
                    // now add closed accounts up to MAX_SUGGESTIONS
                    for (let i = 0; i < accounts.length && accountsToShow.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (!account.open && !checkAccount(account, lcQuery)) {
                            accountsToShow.push(account);
                        }
                    }
                    let result = {suggestions: []};
                    for (let i = 0; i < accountsToShow.length; i++) {
                        let account = accounts[i];
                        let nameString = account.name + "/" + account.account;
                        let typeName = account.isAlpariIndex() ? ", портфель" : account.isAlpariFund() ? ", фонд" : "";
                        let closedTxt = account.open ? "" : ", закрыт";
                        let detailedString = nameString + " (" + account.broker.name + typeName + closedTxt + ")";
                        result.suggestions.push({
                            value: detailedString,
                            data: {category: account.broker.id == 4 ? undefined : "--- закрытые счета ---"}
                        });
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