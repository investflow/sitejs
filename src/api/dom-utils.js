var $ = require("jquery");

function addTitle(el, title) {
    if (!$(el).attr("title")) {
        $(el).attr("title", title);
    }
}

function setTitleBySelector(selector, title, root) {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        addTitle(this, title);
    });
}

module.exports = {
    setTitle: setTitleBySelector
};

export default {
    setTitle: setTitleBySelector
};