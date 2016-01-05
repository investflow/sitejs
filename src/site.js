import "babel-polyfill";
import SiteApp from "./app/SiteApp";
import SiteUtils from  "./api/site-utils";
import Titles from  "./api/titles";

window.$site = {
    Utils: SiteUtils,
    Titles: Titles,
    SiteApp: SiteApp
};

import "./api/parsley-translations";
