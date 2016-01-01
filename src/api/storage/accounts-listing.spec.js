describe("Cached.accountListing test suite", function () {
    var AL = require("./accounts-listing");

    it("list method must be defined", function () {
        expect(AL.list).toBeDefined()
    });

    it("reset method must be defined", function () {
        expect(AL.reset).toBeDefined()
    });

    it("list method must return valid results", function (done) {
        var listPromise = AL.list();
        listPromise.then(function (list) {
            expect(Array.isArray(list)).toBe(true);
            expect(list.length).toBeGreaterThan(1000);
            done();
        });

    });

});
