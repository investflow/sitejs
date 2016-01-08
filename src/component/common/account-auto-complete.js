import $ from "jquery"
import {Account, getCachedAccountsListing} from "../../api/accounts-listing"
import log from "loglevel"

export default {
    attach: function (selector:string):void {
        getCachedAccountsListing().then((accounts:Array<Account>)=> {
            log.warn("accounts: " + accounts.length);
            let options = accounts.map((account)=> {
                return {
                    value: account.name,
                    data: account.name
                }
            });
            $(selector).devbridgeAutocomplete({
                lookup: options,
                onSelect: function (suggestion) {
                    alert("You selected: " + suggestion.value + ", " + suggestion.data);
                }
            });
        });
    }
}