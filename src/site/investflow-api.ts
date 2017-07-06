import * as log from "loglevel";
import {Promise} from "es6-promise";

let SERVER_URL = ((window.location.protocol == "https:") ? "https" : "http") + "://investflow.ru";
const docUrl = document && typeof document.URL === "string" ? document.URL : "";
if (docUrl.indexOf("localhost:8080") >= 0) {
    // log.info("IR: using local instance for queries!");
    SERVER_URL = "http://127.0.0.1:8080";
}
const OP_LIST_ACCOUNTS = "/api/list-accounts?v=1";
const OP_ACCOUNT_INFO = "/api/account-info?v=1";
const REQUEST_TIMEOUT_MILLIS = 30 * 1000;

function query(path: string): Promise<Object> {
    return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest(); // ActiveX blah blah
            request.open("GET", SERVER_URL + path, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    log.trace("IR:query: starting to parse response");
                    resolve(JSON.parse(request.responseText));
                    log.trace("IR:query: response parsed");
                } else {
                    reject("HTTP " + request.status + " for " + path);
                }
            };
            setTimeout(reject, REQUEST_TIMEOUT_MILLIS);
            request.send();
        }
    );
}

export interface ListAccountsResponse {
    result: string;
}

export function listAccounts(): Promise<ListAccountsResponse> {
    return query(OP_LIST_ACCOUNTS) as Promise<ListAccountsResponse>;
}

export interface AccountInfoResponse {
    /** Account number */
    account: string,
    /** Broker id */
    broker: number,
    /** Account name */
    name: string,
    /** Profit history. Array of pairs: [time, percent] */
    profitData: Array<Array<number>>,
    /** Balance history. Array of pairs: [time, amount] */
    balanceData?: Array<Array<number>>,
    /** Equity history. Array of pairs: [time, amount] */
    equityData?: Array<Array<number>>,
    currencyPrefix?: string,
    currencySuffix?: string,
    /** Full url to account page*/
    url: string,
    /** if any -> there was an error processing data on server */
    error: string
}

export function getAccountInfo(brokerId: number, account: string): Promise<AccountInfoResponse> {
    return query(OP_ACCOUNT_INFO + "&broker=" + brokerId + "&account=" + account) as Promise<AccountInfoResponse>;
}