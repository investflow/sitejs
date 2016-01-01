describe("Cached.accountListing test suite", function () {
    var AL = require("./accounts-listing");

    it("Must have list method defined", function () {
        expect(AL.list).toBeDefined()
    });

    it("Must have reset method defined", function () {
        expect(AL.reset).toBeDefined()
    });

    it("list method must return result", function () {
        var list = AL.list();
        expect(list.length).toBeDefined();
        expect(list.length).toBeGreaterThan(1000);
    });

});
