import REST from "./../../src/api/investflow-rest";

describe("REST service test suite", () => {

    it("REST.listAccounts must be defined", () => {
        expect(REST.listAccounts).toBeDefined();
    });

    it("REST.listAccounts must return valid results", (done) => {
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