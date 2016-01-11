import "babel-polyfill";
import SiteApp from "./app/SiteApp";
import SiteUtils from  "./api/site-utils";
import Titles from  "./api/titles";
import AccountAutoComplete from  "./component/common/account-auto-complete";
import site from "./api/site-def";
import lzString from "lz-string"
import log from "loglevel";


/** Set of utility functions */
site.Utils = SiteUtils;

/** Dynamic titles */
site.Titles = Titles;

/** Vue JS app */
site.SiteApp = SiteApp;

/* Account auto-complete controller */
site.AccountAutoComplete = AccountAutoComplete;

/** Site logger */
site.log = log;

/** LZ string compression/decompression algorithms*/
site.lz = lzString;

window.$site = site;

import "./api/parsley-translations";
