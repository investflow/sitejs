import REST from "./../../src/api/investflow-rest";

describe("REST service test suite", function () {

    it("REST.listAccounts must be defined", function () {
        expect(REST.listAccounts).toBeDefined();
    });

    it("REST.listAccounts must return valid results", function (done) {
        REST.listAccounts().then((listing) => {
                expect(Array.isArray(listing)).toBe(true);
                expect(listing.length).toBeGreaterThan(1000);
                done();
            }, (errorMessage) => {
                fail(errorMessage);
                done();
            }
        );
    });

});