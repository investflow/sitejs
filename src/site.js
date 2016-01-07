import "babel-polyfill";
import SiteApp from "./app/SiteApp";
import SiteUtils from  "./api/site-utils";
import Titles from  "./api/titles";
import site from "./api/site-def"


/** Set of utility functions */
site.Utils = SiteUtils;

/** Dynamic titles */
site.Titles = Titles;

/** Vue JS app */
site.SiteApp = SiteApp;

window.$site = site;

import "./api/parsley-translations";
