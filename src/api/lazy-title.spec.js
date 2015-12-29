describe("Test suite self test", function () {

    it("This test must pass", function () {
        var product = 6;
        expect(product).toBe(6);
    });

});

describe("LazyTitle test suite", function () {
    it("Title must be replaced with bySelector method call", function () {
        var $ = require("jquery");
        var lt = require("./lazy-title");

        expect(window.document).toBeDefined();
        expect($).toBeDefined();

        $('<div id="test">X</div>').appendTo(document.body);
        var $test = $("#test");
        expect($test.length).toBe(1);

        var titleString = "Hello World!";
        lt.bySelector("#test", titleString);
        var title = $test.attr("title");
        expect(title).toBeDefined();
        expect(title).toBe(titleString);
    });
});