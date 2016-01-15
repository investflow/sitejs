export default {
    Utils: null,
    Titles: null,
    SiteApp: null,
    AccountAutoComplete: null,
    log: null,
    lz: null,

    /* Service state. Filled by server side.*/
    ServiceState: {

        /** Checksum for account listing */
        accountListingHash: "",

        /**
         * List of brokers ID to use for autocomplete. If null -> all brokers.
         */
        AutocompleteExcludeBrokerIds: undefined
    }
}