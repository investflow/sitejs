var _ = require("underscore");
var Brokers = require("../../api/broker");

var formOptions = _.map(Brokers, function (val) {
    return {text: val.name, value: val.id};
});

module.exports = {
    replace: true,
    template: require('./broker-selector.html'),
    data: function () {
        return {
            selected: Brokers.ALFAFOREX.id,
            options: formOptions
        }
    }
};