let host     = '127.0.0.1'
let name     = 'piksel'
let protocol = 'http'
let db_port  = '5984'

const connection = require('../db/connection')
const chai       = require('chai');
const expect     = chai.expect;

describe("Connection with Default Values", () => {
  it('should create a database instance', async () => {
    expect(connection.couch._baseUrl).to.be.equal(protocol + '://' + host + ':' + db_port)
    expect(connection.dbName).to.be.equal(name)
  })
})