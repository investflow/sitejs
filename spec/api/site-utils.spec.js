import $ from "jquery"
import SiteUtils from "./../../src/api/site-utils";

describe("SiteUtils test suite", function () {
    it("Title must be replaced with setTitle by #id", function () {
        $("<div id='test'>ID</div>").appendTo(document.body);
        expect($("#test")).toBeInDOM();

        var titleToSet = "Hello World!";
        SiteUtils.setTitle("#test", titleToSet);

        expect($("#test")).toHaveAttr("title", titleToSet);
    });

    it("Title must be replaced with setTitle by .class", function () {
        $("<div class='test'>CLASS</div>").appendTo(document.body);
        expect($(".test")).toBeInDOM();

        var titleToSet = "Hello World!";
        SiteUtils.setTitle(".test", titleToSet);

        expect($("#test")).toHaveAttr("title", titleToSet);
    });
});