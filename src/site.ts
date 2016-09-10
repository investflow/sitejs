import SiteUtils from "./site/site-utils";
import Titles from "./site/titles";
import AccountAutoComplete from "./component/account-auto-complete";
import * as log from "loglevel";
import * as lzString from "lz-string";
import Highcharts from "./site/highcharts-support";
import QuoteCharts from "./site/bta/quote-charts";
import Flot from "./site/flot-support";
import site from "./site/site-def";
import {Broker} from "./site/broker";
import "./site/parsley-support";

/** Set of utility functions */
site.Utils = SiteUtils;

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

