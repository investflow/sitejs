export default {
    /* Service state. Filled by server side.*/
    ServiceState: {
        /** Checksum for account listing */
        accountListingHash: "",
        /**
         * List of brokers ID to use for autocomplete. If null -> all brokers.
         */
        AutocompleteExcludeBrokerIds: null
    }
}