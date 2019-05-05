const dbName = process.env.PIKSEL_DATABASE_NAME || 'piksel';
const NodeCouchDb = require('node-couchdb');

const envHost     = process.env.PIKSEL_DATABASE_HOST || '127.0.0.1';
const envProtocol = process.env.PIKSEL_DATABASE_PROTOCOL || 'http';
const envPort     = process.env.PIKSEL_DATABASE_PORT || '5984';

const couch   = new NodeCouchDb({
    host: envHost,
    protocol: envProtocol,
    port: envPort
});

module.exports = { couch, dbName };