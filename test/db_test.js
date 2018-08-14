let chai   = require('chai');
let expect = chai.expect;

let db = require('../db/db');

describe('Database', () => {
    before(() =>{
        db.createDatabase(db.dbName);
    })
    after(() => {
        db.dropDatabase(db.dbName);
    })

    describe('Operations', () => {
        it('should be able to store object with key "A" ', async () => {
            await db.store("A", {name: "John"});
            let resp = await db.get('A');

            expect(resp.object.data.name).to.be.equal("John");
            expect(resp.status_code).to.be.equal(200);
        })

        it('should be able to update data on object with key "B"', async () => {
            await db.store("B", {name: "John"});
            let resp = await db.get("B");

            expect(resp.object.data.name).to.be.equal("John")

            await db.update("B", {name: "Aslan"});
            let updatedResp = await db.get("B");

            expect(updatedResp.object.data.name).to.be.equal("Aslan");
            expect(updatedResp.status_code).to.be.equal(200);
        })

        it('should be able to erase an object with key "C"', async () => {
            await db.store("C", {name: "John"})
            let resp = await db.get("C");

            expect(resp.object.data.name).to.be.equal("John");

            await db.erase("C")
            let deletedResp = await db.get("C");

            expect(deletedResp.status_code).to.be.equal("EDOCMISSING");
        })
    });
});