module.exports = {
    replace: true,
    template: require('./currency-selector.html'),
    data: function () {
        return {
            selectedCurrency: "3",
            allCurrencies: [{text: "one", value: "1"}, {text: "two", value: "2"}, {text: "three", value: "3"}]
        };
    }
};