const mongo = require("mongodb")
const config = require('../config.js')
mongoClient = mongo.MongoClient
let _db;

const mongoConnect = callback => {
    mongoClient.connect(global.gConfig.database, { 
            useUnifiedTopology: true
        })

        .then(client => {
            console.log("Connected")
            _db = client.db()
            callback()
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw "No database found!";
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;