const db      = require('./connection').couch;
const dbName = require('./connection').dbName;

function logError(err){
    console.log("Error code : " + err.code);
    console.log(err);
}

function createDatabase(dbname){
    db.createDatabase(dbName).then(() => {
        return new Promise ((resolve, reject) => resolve({ message: "Successfully created database " + dbname}));
    }, err => {
        return new Promise ((resolve, reject) => resolve({ message: "Failed to create database " + dbname + ". ERROR : " + err.code}));
    });
}

function dropDatabase(dbname){
    db.dropDatabase(dbname).then(() => {
        return new Promise ((resolve, reject) => resolve({ message: "Successfully dropped database " + dbname}));
    }, err => {
        return new Promise ((resolve, reject) => resolve({ message: "Failed to drop database " + dbname + ". ERROR : " + err.code}));
    });
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