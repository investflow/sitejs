import $ from "jquery";

function addTitle(el, title) {
    if (!$(el).attr("title")) {
        $(el).attr("title", title);
    }
}

class DOMUtils {
    static setTitle(selector, title, root) {
        root = root ? root : window.document.body;
        $(root).find(selector).each(function () {
            addTitle(this, title);
        });
    };
}

export default DOMUtils;
