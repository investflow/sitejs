/**
 * Boot up the Vue instance and wire up the router.
 */

var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

var router = new VueRouter();
router.map({
    '/view1': {
        component: require("./components/view1")
    },
    '/view2': {
        component: require("./components/view2")
    }
});

var App = {
    data: function () {
        return {
            message: "Hello!"
        }
    }
};

router.start(App, "#app");

// custom directives
//require('./directives/my-first-directive')(Vue);

// custom filters
//require('./filters/my-first-filter')(Vue);