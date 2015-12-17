module.exports = function () {
    var model = {
        tab: 0
    };
    return {
        template: require('./AddAccountForm.html'),
        components: {
            "add-pamm-account": require("./AddPammAccountPanel")(),
            "add-free-account": require("./AddFreeAccountPanel")()
        },
        methods: {
            showPamms: function (event) {
                event.preventDefault();
                model.tab = 0;
            },
            showFree: function () {
                event.preventDefault();
                model.tab = 1;
            }
        },
        data: function () {
            return model
        }
    };
};