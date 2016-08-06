import * as $ from "jquery";
import {Account, getCachedAccountsListing} from "../site/accounts-listing";
import $site from "../site/site-def";
import * as log from "loglevel";

//TODO: defer subsequent requests.

const MAX_SUGGESTIONS:number = 40;
export default {
    attach: (selector:string):void => {
        let $el:JQuery = $(selector);
        //noinspection JSUnusedGlobalSymbols
        $el.devbridgeAutocomplete({
            lookup: (query:string, done:Function) => {
                log.trace("AAC: lookup: " + query);
                getCachedAccountsListing().then((accounts:Array<Account>) => {
                    let lcQuery:string = query.toLowerCase();
                    let accountsToShow:Array<Account> = [];

                    let checkAccount = (account:Account, q:string):boolean => {
                        return (account.account.toLocaleLowerCase().indexOf(q) >= 0 || account.name.toLocaleLowerCase().indexOf(q) >= 0);
                    };
                    let disabledBrokers:{ [key:number]:boolean; } = {};
                    if ($site.ServiceState.AutocompleteExcludeBrokerIds) {
                        $site.ServiceState.AutocompleteExcludeBrokerIds.forEach((v:number)=> disabledBrokers[v] = true);
                    }
                    // select open accounts first
                    for (let i = 0; i < accounts.length && accountsToShow.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (account.open && !disabledBrokers[account.broker.id] && checkAccount(account, lcQuery)) {
                            accountsToShow.push(account);
                        }
                    }
                    log.trace("AAC: lookup: " + query + " found open: " + accountsToShow.length);
                    // now add closed accounts up to MAX_SUGGESTIONS
                    for (let i = 0; i < accounts.length && accountsToShow.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (!account.open && !disabledBrokers[account.broker.id] && checkAccount(account, lcQuery)) {
                            accountsToShow.push(account);
                        }
                    }
                    // now add accounts from disabled broker up to MAX_SUGGESTIONS
                    for (let i = 0; i < accounts.length && accountsToShow.length < MAX_SUGGESTIONS; i++) {
                        let account = accounts[i];
                        if (disabledBrokers[account.broker.id] && checkAccount(account, lcQuery)) {
                            accountsToShow.push(account);
                        }
                    }
                    log.trace("AAC: lookup: " + query + " to show: " + accountsToShow.length);
                    let result = {suggestions: []};
                    for (let i = 0; i < accountsToShow.length; i++) {
                        let account = accountsToShow[i];
                        let nameString = account.name + "/" + account.account;
                        let typeName = account.isAlpariIndex() ? ", портфель" : account.isAlpariFund() ? ", фонд" : "";
                        let closedTxt = account.open ? "" : ", неактивен";
                        let detailedString = nameString + " (" + account.broker.name + typeName + closedTxt + ")";
                        let category = "";
                        if (disabledBrokers[account.broker.id]) {
                            category = "--- выкл. площадки ---";
                        } else if (!account.open) {
                            category = "--- неактивные счета ---";
                        }
                        result.suggestions.push({value: detailedString, data: {category: category}});
                    }
                    done(result);
                });
            },
            groupBy: "category",
            preserveInput: true,
            maxHeight: 720,
            onSelect: (suggestion:any) => {
                log.trace("Selected option: " + suggestion.value);
                $el.val(suggestion.value);
            }
        });

        //Kind of dirty hack to prevent click event propagation
        $(".autocomplete-suggestions").click((e:Event) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

    }
}