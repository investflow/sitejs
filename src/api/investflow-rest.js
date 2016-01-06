const SERVER_URL = "http://investflow.ru";
//const SERVER_URL = "http://127.0.0.1:8080";
const OP_LIST_ACCOUNTS = SERVER_URL + "/api/list-accounts?v=1";
const TIMEOUT_MILLIS = 30 * 1000;

function query(path:string) {
    return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest(); // ActiveX blah blah
            request.open("GET", path, true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    reject("HTTP " + request.status + " for " + path);
                }
            };
            setTimeout(reject, TIMEOUT_MILLIS);
            request.send();
        }
    );
}

function listAccounts() {
    return query(OP_LIST_ACCOUNTS).then((response) => {
        let packed = response.result;
        return packed.split("\n");
    });
}

export default {
    listAccounts: listAccounts
};
