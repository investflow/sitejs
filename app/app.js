/**
 * Boot up the Vue instance and wire up the router.
 */

var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

var router = new VueRouter();
router.map({
    '/pamm': {
        component: require("./pamm/pamm.js")
    },
    '/stock': {
        component: require("./stock/stock.js")
    },
    '/deposit': {
        component: require("./deposit/deposit.js")
    },
    '/free': {
        component: require("./free/free.js")
    }
});

var App = {
    data: function () {
        return {}
    }
};

router.start(App, "#app");

// custom directives
//require('./directives/my-first-directive')(Vue);

// custom filters
//require('./filters/my-first-filter')(Vue);