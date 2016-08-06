export default {
    Broker: undefined,
    Highcharts: undefined,
    QuoteCharts: undefined,
    Flot: undefined,
    Utils: undefined,
    Titles: undefined,
    SiteApp: undefined,
    AccountAutoComplete: undefined,
    log: undefined,
    lz: undefined,

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