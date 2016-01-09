import {listAccounts,ListAccountsResponse}  from "./../../src/api/investflow-rest";
import log from "loglevel"
log.enableAll();

describe("REST service test suite", () => {

    it("REST.listAccounts must return valid results", (done) => {
        listAccounts().then((response:ListAccountsResponse) => {
                expect(response.result.length).toBeGreaterThan(1000);
                done();
            }, (errorMessage) => {
                fail(errorMessage);
                done();
            }
        );
    });

});