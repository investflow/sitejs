describe("Investflow REST service test suite", function () {
    var IR = require("./investflow-rest");

    it("IR.listAccounts must be defined", function () {
        expect(IR.listAccounts).toBeDefined()
    });

    it("IR.listAccounts must return valid results", function (done) {
        IR.listAccounts().then(
            function (listing) {
                expect(listing).toBeDefined();
                expect(listing.length).toBeDefined();
                expect(listing.length).toBeGreaterThan(1000);
                done();
            },
            function (errorMessage) {
                fail(errorMessage);
                done();
            }
        );
    });

});