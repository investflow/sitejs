import "babel-polyfill";
import SiteApp from "./app/SiteApp";
import DOMUtils from  "./api/dom-utils";
import Titles from  "./api/titles";
import Parsley from  "parsleyjs";

window.$site = {
    DOMUtils: DOMUtils,
    Titles: Titles,
    SiteApp: SiteApp,
    Parsley: Parsley
};

import "./api/parsley-translations";
