// Library Initialization
const chai   = require('chai');
const expect = chai.expect;
const sinon  = require('sinon');

// Dependency Initialization
const couchAdapter = require('../db/adapters/couch');
const db           = require('../db/db');

// Test Data
const testDbName   = 'test_db_name';
const testDbKey    = 'test_db_key';
const testDbObject = { data: 'dbObject' }

describe('DB Adapter Interface', () => {
  describe('CouchDB Adapters', () => {
    describe('Create Database', () => {
      it('should have triggered Create Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'createDatabase');
        await db.createDatabase(testDbName);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbName);

        spy.restore();
      })
    })

    describe('Drop Database', () => {
      it('should have triggered Drop Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'dropDatabase');
        await db.dropDatabase(testDbName);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbName);

        spy.restore();
      })
    })

    describe('Store', () => {
      it('should have triggered Store Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'store');
        await db.store(testDbKey, testDbObject);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbKey, testDbObject);

        spy.restore();
      })
    })

    describe('Get', () => {
      it('should have triggered Get Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'get');
        await db.get(testDbKey);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbKey);

        spy.restore();
      })
    })

    describe('Update', () => {
      it('should have triggered Update Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'update');
        await db.update(testDbKey, testDbObject);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbKey, testDbObject);

        spy.restore();
      })
    })

    describe('Erase', () => {
      it('should have triggered Erase Database Function', async () => {
        let spy = sinon.spy(couchAdapter, 'erase');
        await db.erase(testDbKey);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, testDbKey);

        spy.restore();
      })
    })

    describe('Call DB Name', () => {
      it('should have triggered DB Name Function', async () => {
        let spy = sinon.stub(couchAdapter, 'dbName').value(testDbName)
        let result = await db.dbName();

        expect(result).to.be.equal(testDbName);

        spy.restore();
      })
    })
  })
})
