require('dotenv').config()

const dbName = process.env.PIKSEL_DATABASE_NAME;
const NodeCouchDb = require('node-couchdb');

const couch   = new NodeCouchDb({
    host: process.env.PIKSEL_DATABASE_HOST,
    protocol: process.env.PIKSEL_DATABASE_PROTOCOL,
    port: process.env.PIKSEL_DATABASE_PORT
});

couch.createDatabase(dbName).then(() => {
    console.log("Succeed to create DB with name : " + dbName);
}, err => {
    console.log("Failed to create DB with name : " + dbName + ". Error : " + err);
});

module.exports = { couch, dbName };