import * as $ from "jquery";
import SiteUtils from "../../src/site/site-utils";

describe("SiteUtils test suite", () => {
    it("Title must be replaced with setTitle by #id", () => {
        $("<div id='test'>ID</div>").appendTo(document.body);
        //noinspection JSJQueryEfficiency
        expect($("#test")).toBeInDOM();

        let titleToSet = "Hello World!";
        SiteUtils.setTitle("#test", titleToSet);

        //noinspection JSJQueryEfficiency
        expect($("#test")).toHaveAttr("title", titleToSet);
    });

    it("Title must be replaced with setTitle by .class", () => {
        $("<div class='test'>CLASS</div>").appendTo(document.body);
        expect($(".test")).toBeInDOM();

        let titleToSet = "Hello World!";
        SiteUtils.setTitle(".test", titleToSet);

        expect($("#test")).toHaveAttr("title", titleToSet);
    });
});