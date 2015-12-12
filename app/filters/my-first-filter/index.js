// A demo filter that reverse a string.
module.exports = function (Vue) {
    Vue.filter('my_first_filter', function (value) {
        return value.split('').reverse().join('');
    });
};