describe("DomUtils test suite", function () {
    var $ = require("jquery");
    var lt = require("./dom-utils");

    it("Title must be replaced with setTitle by #id", function () {
        $('<div id="test">ID</div>').appendTo(document.body);
        expect($("#test")).toBeInDOM();

        var titleToSet = "Hello World!";
        lt.setTitle("#test", titleToSet);

        expect($("#test")).toHaveAttr("title", titleToSet);
    });

    it("Title must be replaced with setTitle by .class", function () {
        $('<div class="test">CLASS</div>').appendTo(document.body);
        expect($(".test")).toBeInDOM();

        var titleToSet = "Hello World!";
        lt.setTitle(".test", titleToSet);

        expect($("#test")).toHaveAttr("title", titleToSet);
    });
});