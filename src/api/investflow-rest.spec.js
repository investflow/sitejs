import IR  from "./investflow-rest";

describe("Investflow REST service test suite", function () {

    it("IR.listAccounts must be defined", function () {
        expect(IR.listAccounts).toBeDefined();
    });

    it("IR.listAccounts must return valid results", function (done) {
        IR.listAccounts().then((listing) => {
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