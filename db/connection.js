const dbName = process.env.PIKSEL_DATABASE_NAME;
const NodeCouchDb = require('node-couchdb');

const couch   = new NodeCouchDb({
    host: process.env.PIKSEL_DATABASE_HOST,
    protocol: process.env.PIKSEL_DATABASE_PROTOCOL,
    port: process.env.PIKSEL_DATABASE_PORT
});

module.exports = { couch, dbName };