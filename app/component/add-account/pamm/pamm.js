module.exports = {
    replace: true,
    template: require('./pamm.html'),
    components: {
        "broker-selector": require("../../common/broker-selector.js")
    },
    data: function () {
        return {};
    }
};