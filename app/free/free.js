module.exports = {
    replace: true,
    template: require('./free.html'),
    components: {
        "currency-selector": require("../common/currency-selector.js")
    },
    data: function () {
        return {};
    }
};