import store from "store";
import {listAccounts, ListAccountsResponse} from "./investflow-rest";
import $site from "./site-def"
import {Broker} from "./broker"
import lzString from "lz-string"
import log from "loglevel"

const STORE_LISTING_KEY = "account-listing";
const STORE_LAST_ACCOUNT_ID_KEY = "account-listing-last-id";
const FLAGS_CLOSED = "c";
const FLAGS_INDEX = "i";
const FLAGS_FUND = "f";

export class Account {
    broker:Broker;
    account:string;
    name:string;
    typeName:string;
    open:boolean;
    index:boolean;
    fund:boolean;


    constructor(broker:Broker, account:string, name:string, open:boolean = true) {
        this.broker = broker;
        this.account = account;
        this.name = name;
        this.open = open;
    }

    isAlpariFund():boolean {
        return this.index && this.broker == Broker.ALPARI;
    }

    isAlpariIndex():boolean {
        return this.fund && this.broker == Broker.ALPARI;
    }
}

class Cached {
    static lastAccountId:number = -1;
    static parsedListing:Array<Account> = [];
}

function loadListingFromStore():void {
    log.trace("AL:lfs: started");
    Cached.parsedListing = [];
    Cached.lastAccountId = store.get(STORE_LAST_ACCOUNT_ID_KEY);
    let listing = store.get(STORE_LISTING_KEY);
    if (listing == undefined || typeof listing !== "object" || !listing.data || typeof  listing.data !== "string") {
        log.trace("AL:lfs: finished: no data found");
        return;
    }
    let rawText = lzString.decompress(listing.data);
    if (!rawText) {
        log.trace("AL:lfs: failed to decompress.");
        return;
    }
    let lines = rawText.split("\n");
    log.trace("AL:lfs: lines:" + lines.length + ", raw len: " + rawText.length);
    let parseErrorLogged = false;
    lines.forEach((line) => {
        if (line.length == 0) {
            return;
        }
        let brokerEndIdx = line.indexOf(",");
        let flagsEndIdx = line.indexOf(",", brokerEndIdx + 1);
        let accountEndIdx = line.indexOf(",", flagsEndIdx + 1);
        if (accountEndIdx == -1) {
            if (!parseErrorLogged) {
                log.warn("AL:lfs: failed to parse line: " + line);
                parseErrorLogged = true;
            }
            return;
        }
        let brokerIdToken = line.substr(0, brokerEndIdx);
        let brokerId = parseInt(brokerIdToken);
        let broker = Broker.getBrokerById(brokerId);
        if (!broker) {
            if (brokerId != 24 && brokerId != 29) { // mt4 & myfxbook -> todo: add to brokers list
                if (!parseErrorLogged) {
                    log.warn("AL:lfs: failed to parse broker: '" + brokerIdToken + "' in line: " + line);
                    parseErrorLogged = true;
                }
            }
            return;
        }
        let flags = line.substr(brokerEndIdx + 1, flagsEndIdx - brokerEndIdx - 1);
        let account = line.substr(flagsEndIdx + 1, accountEndIdx - flagsEndIdx - 1);
        let name = line.substr(accountEndIdx + 1);
        let open = flags.indexOf(FLAGS_CLOSED) < 0;
        let res = new Account(broker, account, name, open);
        if (broker == Broker.ALPARI) {
            res.index = flags.indexOf(FLAGS_INDEX) >= 0;
            res.fund = flags.indexOf(FLAGS_FUND) >= 0;
        }
        res.typeName = res.index ? ", " : res.fund ? ", фонд" : "";
        Cached.parsedListing.push(res);
    });
    log.trace("AL:lfs: finished, found: " + Cached.parsedListing.length + " items");
}

export function getCachedAccountsListing(forceUpdate:boolean = false):Promise<Array<Account>> {
    log.trace("AL:gca, cached len:" + Cached.parsedListing.length + " lastId: " + Cached.lastAccountId
        + ", siteLastId:" + $site.ServiceState.lastAccountId + ", force: " + forceUpdate);
    if (forceUpdate) {
        store.remove(STORE_LISTING_KEY);
        store.remove(STORE_LAST_ACCOUNT_ID_KEY);
        Cached.lastAccountId = -1;
        Cached.parsedListing = [];
    } else if (Cached.parsedListing.length == 0) {
        loadListingFromStore();
    }

    if (Cached.parsedListing.length > 0 && Cached.lastAccountId == $site.ServiceState.lastAccountId) {
        log.trace("AL:gca: using cached listing");
        return Promise.resolve(Cached.parsedListing);
    }
    log.trace("AL:gca: fetching listing from web");
    return listAccounts().then((response:ListAccountsResponse) => {
        let compressedData = lzString.compress(response.result);
        log.trace("AL:gca: fetch complete: raw len: " + response.result.length + ", compressed len: " + compressedData.length);
        store.set(STORE_LISTING_KEY, {data: compressedData});
        store.set(STORE_LAST_ACCOUNT_ID_KEY, $site.ServiceState.lastAccountId);
        loadListingFromStore();
        Cached.lastAccountId = $site.ServiceState.lastAccountId;
        return Promise.resolve(Cached.parsedListing);
    });
}
