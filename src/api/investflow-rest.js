var Q = require("q");


var SERVER_URL = "http://investflow.ru";
var OP_LIST_ACCOUNTS = SERVER_URL + "/api/list-accounts?v=1";
var TIMEOUT_MILLIS = 30 * 1000;

function query(path) {
    var response = Q.defer();
    var request = new XMLHttpRequest(); // ActiveX blah blah
    request.open("GET", path, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                response.resolve(request.responseText);
            } else {
                response.reject("HTTP " + request.status + " for " + path);
            }
        }
    };
    setTimeout(response.reject, TIMEOUT_MILLIS);
    request.send('');
    return response.promise;
}

function listAccounts() {
    return query(OP_LIST_ACCOUNTS);
}

module.exports = {
    listAccounts: listAccounts
};
