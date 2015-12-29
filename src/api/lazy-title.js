var $ = require("jquery");
var _ = require("underscore");

function byElement(el, title) {
    if (!$(el).attr("title")) {
        $(el).attr("title", title);
    }
}

function bySelector(selector, title, root) {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        byElement(this, title);
    });
}

module.exports = {
    bySelector: bySelector,

    // List of predefined widgets & titles.
    infoPanel: function (root) {
        bySelector(".pi-lr", "Доходность за последние календарные месяцы. Новые снизу.", root);
    }
};
