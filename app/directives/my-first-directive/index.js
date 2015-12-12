// A demo directive that set the element's color to blue.
module.exports = function (Vue) {
    Vue.directive('my_first_directive', {
        bind: function () {
            this.el.style.color = '#0077C0';
        }
    });
};