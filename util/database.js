const mongo = require("mongodb");
mongoClient = mongo.MongoClient
let _db;

const stringquery = 'mongodb+srv://cjamaefula:dinma1990@cluster0-ck9mx.mongodb.net/nature-palette?retryWrites=true&w=majority'

const mongoConnect = callback => {
    mongoClient.connect(stringquery, { 
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
exports.stringquery = stringquery;