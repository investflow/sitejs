import "babel-polyfill";
import SiteApp from "./app/SiteApp";
import SiteUtils from  "./api/site-utils";
import Titles from  "./api/titles";
import AccountAutoComplete from  "./component/common/account-auto-complete";
import site from "./api/site-def";
import log from "loglevel";


/** Set of utility functions */
site.Utils = SiteUtils;

/** Dynamic titles */
site.Titles = Titles;

/** Vue JS app */
site.SiteApp = SiteApp;

site.AccountAutoComplete = AccountAutoComplete;

site.log = log;

window.$site = site;

import "./api/parsley-translations";
