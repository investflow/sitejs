import {Account, getCachedAccountsListing} from "./../../src/api/accounts-listing";
import {Broker} from "./../../src/api/broker";

describe("AccountListing test suite", () => {

    it("list method must return thousands of results", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts) => {
            expect(Array.isArray(accounts)).toBe(true);
            expect(accounts.length).toBeGreaterThan(1000);
            done();
        });
    });

    it("result must contain known accounts", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts:Array<Account>) => {
            let found = false;
            for (let a:Account of accounts) {
                if (a.broker === Broker.ALPARI && a.name === "Freya") {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(true);
            done();
        });
    });

});
