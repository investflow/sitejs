import {Account, getCachedAccountsListing} from "../../src/site/accounts-listing";
import {Broker} from "../../src/site/broker";
import * as store from "store";

describe("AccountListing test suite", () => {

    beforeEach(()=> {
        store.clear();
    });

    it("list method must return thousands of results", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts:Array<Account>) => {
            expect(Array.isArray(accounts)).toBe(true);
            expect(accounts.length).toBeGreaterThan(1000);
            done();
        });
    });

    it("result must contain known accounts from Alpari", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts:Array<Account>) => {
            let found = false;
            for (let a of accounts) {
                if (a.broker === Broker.ALPARI && a.name === "Freya") {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(true);
            done();
        });
    });

    it("result must contain known accounts from MOEX", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts:Array<Account>) => {
            let found = false;
            for (let a of accounts) {
                if (a.broker === Broker.MOEX && a.account === "AFLT") {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(true);
            done();
        });
    });

    it("result must contain both open and close accounts", (done) => {
        let listPromise = getCachedAccountsListing();
        listPromise.then((accounts:Array<Account>) => {
            let foundOpen = false;
            let foundClosed = false;
            for (let a of accounts) {
                foundClosed = foundClosed || !a.open;
                foundOpen = foundOpen || a.open;
                if (foundOpen && foundClosed) {
                    break;
                }
            }
            expect(foundOpen).toBe(true);
            expect(foundClosed).toBe(true);
            done();
        });
    });

});
