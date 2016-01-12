import * as log from "loglevel"

let SERVER_URL = ((window.location.protocol == "https:") ? "https" : "http") + "://investflow.ru";
const docUrl = document && typeof document.URL === "string" ? document.URL : "";
if (docUrl.indexOf("localhost:8080") >= 0 || docUrl.indexOf("127.0.0.1") >= 0) {
    log.info("IR: using local instance for queries!");
    SERVER_URL = "http://127.0.0.1:8080";
}
const OP_LIST_ACCOUNTS = "/api/list-accounts?v=1";
const REQUEST_TIMEOUT_MILLIS = 30 * 1000;

function query(path:string):Promise<Object> {
    log.trace("IR:query: " + path);
    return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest(); // ActiveX blah blah
            request.open("GET", SERVER_URL + path, true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
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
export class ListAccountsResponse {
    result:string;

    constructor(result:string) {
        this.result = result;
    }
}
export function listAccounts():Promise<ListAccountsResponse> {
    return query(OP_LIST_ACCOUNTS);
}
