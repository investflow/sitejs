import log from "loglevel"

const SERVER_URL = "http://investflow.ru";
//const SERVER_URL = "http://127.0.0.1:8080";
const OP_LIST_ACCOUNTS = "/api/list-accounts?v=1";
const REQUEST_TIMEOUT_MILLIS = 30 * 1000;

function query(path:string):Promise<Object> {
    log.trace("IR:query: " + path);
    return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest(); // ActiveX blah blah
            request.open("GET", SERVER_URL + path, true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(request.responseText));
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
