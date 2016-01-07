import store from "store";
import {listAccounts, ListAccountsResponse} from "./investflow-rest";
import site from "./site-def"
import {Broker, getBrokerById} from "./broker"
import log from "loglevel"

const STORE_LISTING_KEY = "account-listing";
const FLAGS_OPEN = "o";
//const FLAGS_INDEX = "i";

export class Account {
    constructor(broker:Broker, account:string, name:string, typeName:string, open:boolean = true) {
        this.broker = broker;
        this.account = account;
        this.name = name;
        this.typeName = typeName;
        this.open = open;
    }
}

let lastAccountId:number = 0;
let parsedListing:Array<Account> = [];

function loadListingFromStore():void {
    parsedListing = [];
    let listing = store.get(STORE_LISTING_KEY);
    if (listing == undefined || typeof listing !== "string") {
        return;
    }
    let lines = listing.split("\n");
    lines.forEach((line) => {
        if (line.length == 0) {
            return;
        }
        let brokerEndIdx = line.indexOf(",");
        let flagsEndIdx = line.indexOf(",", brokerEndIdx + 1);
        let accountEndIdx = line.indexOf(",", flagsEndIdx + 1);
        if (accountEndIdx == -1) {
            log.warn("Failed to parse line: " + line);
            return;
        }
        let brokerIdToken = line.substr(0, brokerEndIdx);
        let brokerId = parseInt(brokerIdToken);
        let broker = getBrokerById(brokerId);
        if (!broker) {
            if (brokerId < 0 || broker > 30) {
                log.warn("Failed to parse broker: '" + brokerIdToken + "' in line: " + line);
            }
            return;
        }
        let flags = line.substr(brokerEndIdx + 1, flagsEndIdx - brokerEndIdx - 1);
        let account = line.substr(flagsEndIdx + 1, accountEndIdx - flagsEndIdx - 1);
        let name = line.substr(accountEndIdx + 1);
        let typeName = "";//todo
        let open = flags.indexOf(FLAGS_OPEN) >= 0;
        parsedListing.push(new Account(broker, account, name, typeName, open));
    });
}

export function getCachedAccountsListing(forceUpdate = false):Promise<Account> {
    if (forceUpdate) {
        store.remove(STORE_LISTING_KEY);
        lastAccountId = 0;
        parsedListing = [];
    }
    if (!forceUpdate && parsedListing.length == 0) {
        loadListingFromStore();
    }
    if (forceUpdate || (parsedListing.length == 0 || lastAccountId <= 0 || lastAccountId < site.ServiceState.lastAccountId)) {
        return listAccounts().then((response:ListAccountsResponse) => {
            store.set(STORE_LISTING_KEY, response.result);
            loadListingFromStore();
            return Promise.resolve(parsedListing);
        });
    }
    return Promise.resolve(parsedListing);
}
