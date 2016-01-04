import "babel-polyfill";
import siteApp from "./app/SiteApp";

window.$site = {
    DOMUtils: require("./api/dom-utils"),
    Titles: require("./api/titles"),
    SiteApp: siteApp,
    Parsley: require("parsleyjs")
};

require("./api/parsley-translations");
