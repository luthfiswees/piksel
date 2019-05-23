const NodeCouchDb = require('node-couchdb');

const dbAdapter = process.env.ADAPTER || 'couch'; 
const dbName    = process.env.PIKSEL_DATABASE_NAME || 'piksel';

const couchEnvHost     = process.env.PIKSEL_COUCHDB_HOST || '127.0.0.1';
const couchEnvProtocol = process.env.PIKSEL_COUCHDB_PROTOCOL || 'http';
const couchEnvPort     = process.env.PIKSEL_COUCHDB_PORT || '5984';

let dbObject;
switch(dbAdapter){
    default:
        dbObject = new NodeCouchDb({
            host: couchEnvHost,
            protocol: couchEnvProtocol,
            port: couchEnvPort
        });
        break;
}

const database = dbObject;

module.exports = { database, dbName };