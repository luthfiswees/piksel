const adapter = process.env.ADAPTER;
const couchDb = require('./adapters/couch');

function createDatabase(dbName) {
  switch (adapter) {
    default:
      return couchDb.createDatabase(dbName);
  }
}

function dropDatabase(dbName) {
  switch (adapter) {
    default:
      return couchDb.dropDatabase(dbName);
  }
}

function store(key, obj) {
  switch(adapter) {
    default:
      return couchDb.store(key, obj)
  }
}

function get(key) {
  switch(adapter) {
    default:
      return couchDb.get(key);
  }
}

function update(key, obj) {
  switch(adapter) {
    default:
      return couchDb.update(key, obj);
  }
}

function erase(key) {
  switch(adapter) {
    default:
      return couchDb.erase(key);
  }
}

function dbName() {
  switch(adapter) {
    default:
      return couchDb.dbName;
  }
}

module.exports = {
  dbName,
  dropDatabase,
  createDatabase,
  store,
  get,
  update,
  erase
}