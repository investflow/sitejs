module.exports = function () {
    var _ = require("underscore");
    var Brokers = require("../../api/broker");

    var formOptions = _.map(Brokers, function (val) {
        return {text: val.name, value: val.id};
    });

    return {
        template: require('./broker-selector.html'),
        data: function () {
            return {
                selected: Brokers.ALFAFOREX.id,
                options: formOptions
            };
        }
    };
};