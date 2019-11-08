const getDb = require("../util/database").getDb;

module.exports = class RawFile {
    constructor(fileName, type, path, uploadDate, metadata) {
        this.fileName = fileName;
        this.type = type;
        this.path = path;
        this.uploadDate = new Date(Date.now()).toISOString();
        this.metadata = metadata
    }

    static saveMany(list){
        const db = getDb()
        return db.collection("rawfile").insertMany(list)
    }
    save(){
        const db = getDb();
        
        db.collection('rawfile').insertOne(this)
            .then(result => {
                return result.insertedId;
            })
            .catch(e => {
                console.log(e);
                0;
            });
    }
}