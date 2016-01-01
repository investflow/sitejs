var Q = require("q");


//var SERVER_URL = "http://investflow.ru";
var SERVER_URL = "http://localhost:8080";
var OP_LIST_ACCOUNTS = SERVER_URL + "/api/list-accounts?v=1";
var TIMEOUT_MILLIS = 30 * 1000;

function query(path, successCallback) {
    var response = Q.defer();
    var request = new XMLHttpRequest(); // ActiveX blah blah
    request.open("GET", path, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var responseJson = JSON.parse(request.responseText);
                successCallback(response, responseJson);
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
    return query(OP_LIST_ACCOUNTS, function (deferred, data) {
        var packed = data.result;
        var lines = packed.split("\n");
        deferred.resolve(lines);
    });
}

module.exports = {
    listAccounts: listAccounts
};
