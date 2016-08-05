import SiteUtils from "./api/site-utils";
import MqlSupport from "./api/mql-support";
import Titles from "./api/titles";
import AccountAutoComplete from "./component/account-auto-complete";
import * as log from "loglevel";
import * as lzString from "lz-string";
import Highcharts from "./api/highcharts-support";
import QuoteCharts from "./api/quote-charts";
import Flot from "./api/flot-support";
import site from "./api/site-def";
import {Broker} from "./api/broker";
import "./api/parsley-support";
import "./api/mql-highlight";

/** Set of utility functions */
site.Utils = SiteUtils;

/** Support for MQL4/5 languages */
site.Mql = MqlSupport;

/** Dynamic titles */
site.Titles = Titles;

/* Account auto-complete controller */
site.AccountAutoComplete = AccountAutoComplete;

/* Site logger */
site.log = log;

/* LZ string compression/decompression algorithms*/
site.lz = lzString;

/* Highcharts helpers */
site.Highcharts = Highcharts;

/* QuoteCharts helpers */
site.QuoteCharts = QuoteCharts;

/* Flot helpers */
site.Flot = Flot;

site.Broker = Broker;

(<any>window).$site = site;

