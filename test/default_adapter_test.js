let host     = '127.0.0.1'
let name     = 'piksel'
let protocol = 'http'
let db_port  = '5984'
let adapter  = 'anything'

process.env.PIKSEL_COUCHDB_HOST     = host
process.env.PIKSEL_COUCHDB_NAME     = name
process.env.PIKSEL_COUCHDB_PROTOCOL = protocol
process.env.PIKSEL_COUCHDB_PORT     = db_port
process.env.ADAPTER                 = adapter

const connection = require('../db/connection')
const chai       = require('chai');
const expect     = chai.expect;

describe("Connection with Non Existent Adapter", () => {
  it('should create a default database instance', async () => {
    expect(connection.database._baseUrl).to.be.equal(protocol + '://' + host + ':' + db_port)
    expect(connection.dbName).to.be.equal(name)

    delete process.env.PIKSEL_COUCHDB_HOST
    delete process.env.PIKSEL_COUCHDB_NAME
    delete process.env.PIKSEL_COUCHDB_PROTOCOL
    delete process.env.PIKSEL_COUCHDB_PORT
  })
})