import store from "store";
import {listAccounts, ListAccountsResponse} from "./investflow-rest";
import $site from "./site-def"
import {Broker} from "./broker"
import log from "loglevel"

const STORE_LISTING_KEY = "account-listing";
const STORE_LAST_ACCOUNT_ID_KEY = "account-listing-last-id";
const FLAGS_CLOSED = "c";
//const FLAGS_INDEX = "i";

export class Account {
    broker:Broker;
    account:string;
    name:string;
    typeName:string;
    open:boolean;

    constructor(broker:Broker, account:string, name:string, typeName:string, open:boolean = true) {
        this.broker = broker;
        this.account = account;
        this.name = name;
        this.typeName = typeName;
        this.open = open;
    }

    //noinspection JSMethodCanBeStatic
    isAlpariFund():boolean {
        return false;
        //todo: return broker == Broker.ALPARI && ;
    }

    //noinspection JSMethodCanBeStatic
    isAlpariIndex():boolean {
        return false;
        //todo: return broker == Broker.ALPARI && ;
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
    if (listing == undefined || typeof listing !== "string") {
        log.trace("AL:lfs: finished: no data found");
        return;
    }
    let lines = listing.split("\n");
    log.trace("AL:lfs: lines:" + lines.length);
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
        let typeName = "";//todo
        let open = flags.indexOf(FLAGS_CLOSED) < 0;
        Cached.parsedListing.push(new Account(broker, account, name, typeName, open));
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
        store.set(STORE_LISTING_KEY, response.result);
        store.set(STORE_LAST_ACCOUNT_ID_KEY, $site.ServiceState.lastAccountId);
        loadListingFromStore();
        Cached.lastAccountId = $site.ServiceState.lastAccountId;
        return Promise.resolve(Cached.parsedListing);
    });
}
