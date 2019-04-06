// Library initialization
const chai   = require('chai');
const expect = chai.expect;

const db = require('../db/db');

const sinon = require('sinon');
const couch = require('../db/connection').couch;

// Test Objects
const testDbName = process.env.PIKSEL_DATABASE_NAME;
const testDbKey  = 'my_db_key';
const testObject = {
    _id: "123",
    _rev: "1",
    name: "John"
}
const testHeader = { "Content-Type": "application/json" }
const resolveBody = {
    data: testObject,
    header: testHeader,
    status: "ENTRYEXIST"
}
const rejectBody = { code: 'EUNKNOWN' }
const rejectBodyBySameEntry = { code: 'EDOCCONFLICT' }

// Test Cases
describe('Database', () => {
    describe('Database creation and teardown', () => {
        it ("should have created a db", async () => {
            let stub = sinon.stub(couch, 'createDatabase').resolves();

            let resp = await db.createDatabase(testDbName)
            
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, testDbName);
            expect(resp.message).to.be.equal("Successfully created database " + testDbName);
    
            stub.restore();
        })
    
        it ("should have dropped a db", async () => {
            let stub = sinon.stub(couch, 'dropDatabase').resolves();
    
            let resp = await db.dropDatabase(testDbName)
    
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, testDbName);
            expect(resp.message).to.be.equal("Successfully dropped database " + testDbName);
    
            stub.restore();
        })

        it('should have return error message if database is uncontactable', async () => {
            let rejectBody = { code: 'EUNKNOWN' }
            let stubCreate = sinon.stub(couch, 'createDatabase').rejects(rejectBody);
            let stubDrop   = sinon.stub(couch, 'dropDatabase').rejects(rejectBody);

            let respCreate = await db.createDatabase(testDbName)
            let respDrop = await db.dropDatabase(testDbName)

            sinon.assert.calledOnce(stubCreate);
            sinon.assert.calledWith(stubCreate, testDbName);
            sinon.assert.calledOnce(stubDrop);
            sinon.assert.calledWith(stubDrop, testDbName);
            expect(respCreate.message).to.be.equal("Failed to create database " + testDbName + ". ERROR : EUNKNOWN");
            expect(respDrop.message).to.be.equal("Failed to drop database " + testDbName + ". ERROR : EUNKNOWN");
        })
    })

    describe('Database Operation', () => {
        describe("Store", () => {
            it('should be able to store object with keys', async () => {
                let stub = sinon.stub(couch, "insert").callsFake(() => {
                    return Promise.resolve(resolveBody);
                })
    
                let resp = await db.store(testDbKey, testObject)
    
                sinon.assert.calledOnce(stub);
                sinon.assert.calledWith(stub, testDbName, {_id: testDbKey, data: testObject})
                expect(resp.object.name).to.be.equal("John");
                expect(resp.object._id).to.be.equal("123");
                expect(resp.object._rev).to.be.equal("1");
                expect(resp.status_code).to.be.equal("ENTRYEXIST");
    
                stub.restore();
            })
    
            it('should be able to store and update automatically if entry already exist', async () => {
                let stubInsert = sinon.stub(couch, "insert").callsFake(() => {
                    return Promise.reject(rejectBodyBySameEntry);
                })
                let stubUpdate = sinon.stub(couch, "update").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })
                let stubGet = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })
    
                let resp = await db.store(testDbKey, testObject)
    
                sinon.assert.calledOnce(stubInsert);
                sinon.assert.calledWith(stubInsert, testDbName, {_id: testDbKey, data: testObject})
                sinon.assert.calledOnce(stubUpdate);
                sinon.assert.calledWith(stubUpdate, testDbName, {_id: testDbKey, _rev: testObject._rev, data: testObject})
                sinon.assert.calledOnce(stubGet);
                sinon.assert.calledWith(stubGet, testDbName, testDbKey)
                expect(resp.object.name).to.be.equal("John");
                expect(resp.object._id).to.be.equal("123");
                expect(resp.object._rev).to.be.equal("1");
                expect(resp.status_code).to.be.equal("ENTRYEXIST");
    
                stubInsert.restore();
                stubUpdate.restore();
                stubGet.restore();
            })

            it('should be able to return error message if it fails to store', async () => {
                let stub = sinon.stub(couch, "insert").callsFake(() => {
                    return Promise.reject(rejectBody);
                })

                let resp = await db.store(testDbKey, testObject)

                sinon.assert.calledOnce(stub);
                sinon.assert.calledWith(stub, testDbName, {_id: testDbKey, data: testObject});
                expect(resp.object).to.be.empty;
                expect(resp.status_code).to.be.equal("EUNKNOWN");

                stub.restore();
            })
        })

        describe("Get", () => {
            it('should be able to retrieve available data', async () => {
                let stub = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })

                let resp = await db.get(testDbKey);

                sinon.assert.calledOnce(stub);
                sinon.assert.calledWith(stub, testDbName, testDbKey);
                expect(resp.object.name).to.be.equal("John");
                expect(resp.object._id).to.be.equal("123");
                expect(resp.object._rev).to.be.equal("1");
                expect(resp.status_code).to.be.equal("ENTRYEXIST");

                stub.restore();
            })

            it('should be able to return error message if db is not contactable', async () => {
                let stub = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.reject(rejectBody)
                })

                let resp = await db.get(testDbKey)

                sinon.assert.calledOnce(stub);
                sinon.assert.calledWith(stub, testDbName, testDbKey);
                expect(resp.object).to.be.empty;
                expect(resp.status_code).to.be.equal("EUNKNOWN");

                stub.restore();
            })
        });

        describe("Update", () => {
            it('should be able to update existing entry', async () => {
                let stubUpdate = sinon.stub(couch, "update").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })
                let stubGet = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })

                let resp = await db.update(testDbKey, testObject);

                sinon.assert.calledOnce(stubGet);
                sinon.assert.calledWith(stubGet, testDbName, testDbKey)
                sinon.assert.calledOnce(stubUpdate);
                sinon.assert.calledWith(stubUpdate, testDbName, {_id: testDbKey, _rev: testObject._rev, data: testObject})
                expect(resp.object.name).to.be.equal("John");
                expect(resp.object._id).to.be.equal("123");
                expect(resp.object._rev).to.be.equal("1");
                expect(resp.status_code).to.be.equal("ENTRYEXIST");

                stubUpdate.restore();
                stubGet.restore();
            })

            it('should be able to return error message if db is not contactable', async () => {
                let stubUpdate = sinon.stub(couch, "update").callsFake(() => {
                    return Promise.reject(rejectBody)
                })
                let stubGet = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })

                let resp = await db.update(testDbKey, testObject);

                sinon.assert.calledOnce(stubGet);
                sinon.assert.calledWith(stubGet, testDbName, testDbKey)
                sinon.assert.calledOnce(stubUpdate);
                sinon.assert.calledWith(stubUpdate, testDbName, {_id: testDbKey, _rev: testObject._rev, data: testObject})
                expect(resp.object).to.be.empty;
                expect(resp.status_code).to.be.equal("EUNKNOWN");

                stubUpdate.restore();
                stubGet.restore();
            })
        });

        describe("Erase", () => {
            it("should be able to erase existing entry", async () => {
                let stubDelete = sinon.stub(couch, "del").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })
                let stubGet = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })

                let resp = await db.erase(testDbKey);

                sinon.assert.calledOnce(stubGet);
                sinon.assert.calledWith(stubGet, testDbName, testDbKey)
                sinon.assert.calledOnce(stubDelete);
                sinon.assert.calledWith(stubDelete, testDbName, testDbKey, testObject._rev)
                expect(resp.object.name).to.be.equal("John");
                expect(resp.object._id).to.be.equal("123");
                expect(resp.object._rev).to.be.equal("1");
                expect(resp.status_code).to.be.equal("ENTRYEXIST");

                stubDelete.restore();
                stubGet.restore();
            })

            it('should be able to return error message if db is not contactable', async () => {
                let stubDelete = sinon.stub(couch, "del").callsFake(() => {
                    return Promise.reject(rejectBody)
                })
                let stubGet = sinon.stub(couch, "get").callsFake(() => {
                    return Promise.resolve(resolveBody)
                })

                let resp = await db.erase(testDbKey);

                sinon.assert.calledOnce(stubGet);
                sinon.assert.calledWith(stubGet, testDbName, testDbKey)
                sinon.assert.calledOnce(stubDelete);
                sinon.assert.calledWith(stubDelete, testDbName, testDbKey, testObject._rev)
                expect(resp.object).to.be.empty;
                expect(resp.status_code).to.be.equal("EUNKNOWN");

                stubDelete.restore();
                stubGet.restore();
            })
        })
    })
});