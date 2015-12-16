module.exports = {
    create: function (elementId) {
        var Vue = require('vue');
        return new Vue({
            el: elementId,
            components: {
                "add-pamm-account": require("./pamm/pamm"),
                "add-free-account": require("./free/free")
            },
            methods: {
                showPamms: function (event) {
                    event.preventDefault();
                    this.tab = 0;
                },
                showFree: function () {
                    event.preventDefault();
                    this.tab = 1;
                }
            },
            data: {
                tab: 0
            }
        });

    }
};

