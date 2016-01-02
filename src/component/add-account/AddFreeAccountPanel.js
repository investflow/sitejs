module.exports = function () {
    var model = {};
    return {
        template: require('./AddFreeAccountPanel.html'),
        components: {
            "currency-selector": require("../common/currency-selector.js")()
        },
        data: function() {
            return model;
        }
    };
};