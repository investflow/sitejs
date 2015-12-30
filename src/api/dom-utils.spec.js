describe("DomUtils test suite", function () {
    var $ = require("jquery");
    var lt = require("./dom-utils");

    it("Title must be replaced with setTitle by #id", function () {
        $('<div id="test">ID</div>').appendTo(document.body);
        var $test = $("#test");
        expect($test.length).toBe(1);

        var titleToSet = "Hello World!";
        lt.setTitle("#test", titleToSet);

        var elementTitle = $test.attr("title");
        expect(elementTitle).toBeDefined();
        expect(elementTitle).toBe(titleToSet);
    });

    it("Title must be replaced with setTitle by .class", function () {
        $('<div class="test">CLASS</div>').appendTo(document.body);
        var $test = $(".test");
        expect($test.length).toBe(1);

        var titleToSet = "Hello World!";
        lt.setTitle(".test", titleToSet);

        var elementTitle = $test.attr("title");
        expect(elementTitle).toBeDefined();
        expect(elementTitle).toBe(titleToSet);
    });
});