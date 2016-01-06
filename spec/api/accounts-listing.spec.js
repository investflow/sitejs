import {AccountListing as al} from "./../../src/api/accounts-listing";

describe("AccountListing test suite", () => {

    it("list method must be defined", () => {
        expect(al.list).toBeDefined();
    });

    it("reset method must be defined", () => {
        expect(al.reset).toBeDefined();
    });

    it("list method must return valid results", (done) => {
        let listPromise = al.list();
        listPromise.then((list) => {
            expect(Array.isArray(list)).toBe(true);
            expect(list.length).toBeGreaterThan(1000);
            done();
        });
    });

});
