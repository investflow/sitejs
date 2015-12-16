var _ = require("underscore");
var Currency = require("../../api/currency");
var ActiveCurrencies = require("../../api/account-currency").Active;

var formOptions = _.map(ActiveCurrencies, function (val) {
    return {text: val.name, value: val.id};
});

module.exports = {
    replace: true,
    template: require('./currency-selector.html'),
    data: function () {
        return {
            selected: Currency.RUB.id,
            options: formOptions
        }
    }
};