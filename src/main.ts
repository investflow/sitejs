import SiteApp from "./app/SiteApp";
import SiteUtils from "./api/site-utils";
import Titles from "./api/titles";
import AccountAutoComplete from "./component/common/account-auto-complete";
import * as log from "loglevel";
import * as lzString from "lz-string";
import Highcharts from "./api/highcharts-support";
import Flot from "./api/flot-support";
import site from "./api/site-def";
import "./api/parsley-translations";

/** Set of utility functions */
site.Utils = SiteUtils;

/** Dynamic titles */
site.Titles = Titles;

/** Vue JS app */
site.SiteApp = SiteApp;

/* Account auto-complete controller */
site.AccountAutoComplete = AccountAutoComplete;

/* Site logger */
site.log = log;

/* LZ string compression/decompression algorithms*/
site.lz = lzString;

/* Highcharts helpers */
site.Highcharts = Highcharts;

/* Flot helpers */
site.Flot = Flot;

(<any>window).$site = site;

