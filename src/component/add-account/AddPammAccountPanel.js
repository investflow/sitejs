module.exports = function () {
    var model = {};
    return {
        template: require('./AddPammAccountPanel.html'),
        components: {
            "broker-selector": require("../common/broker-selector.js")()
        },
        data: function() {
            return model;
        }
    };
};