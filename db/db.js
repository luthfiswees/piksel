const db      = require('./connection').couch;
const dbName = require('./connection').dbName;

async function createDatabase(dbname){
    let result = db.createDatabase(dbname).then(() => {
        return new Promise ((resolve, reject) => resolve({ message: "Successfully created database " + dbname}));
    }, err => {
        return new Promise ((resolve, reject) => resolve({ message: "Failed to create database " + dbname + ". ERROR : " + err.code}));
    });

    return result;
}

async function dropDatabase(dbname){
    let result = db.dropDatabase(dbname).then(() => {
        return new Promise ((resolve, reject) => resolve({ message: "Successfully dropped database " + dbname}));
    }, err => {
        return new Promise ((resolve, reject) => resolve({ message: "Failed to drop database " + dbname + ". ERROR : " + err.code}));
    });

    return result;
}

async function store(key, obj) {
    let result = await db.insert(dbName, {
        _id: key,
        data: obj
    }).then(({data, headers, status}) => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: data,
                status_code: status
            });
        });
    }, err => {
        if (err.code == 'EDOCCONFLICT') {
            return update(key, obj);
        } else {
            return new Promise ((resolve, reject) => {
                resolve({
                    object: {},
                    status_code: err.code
                });
            });
        }
    });

    return result;
};

async function get(key) {
    let result = await db.get(dbName, key).then(({data, headers, status}) => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: data,
                status_code: status
            });
        });
    }, err => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: {},
                status_code: err.code
            });
        });
    });

    return result;
}

async function update(key, obj) {
    let formerObj = await get(key);

    let result = await db.update(dbName, {
        _id: key,
        _rev: formerObj.object._rev,
        data: obj
    }).then(({data, headers, status}) => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: data,
                status_code: status
            });
        });
    }, err => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: {},
                status_code: err.code
            });
        });
    });

    return result;
}

async function erase(key) {
    let formerObj = await get(key);

    let result = await db.del(dbName, key, formerObj.object._rev).then(({data, headers, status}) => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: data,
                status_code: status
            });
        });
    }, err => {
        return new Promise ((resolve, reject) => {
            resolve({
                object: {},
                status_code: err.code
            });
        });
    });

    return result;
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