const getDb = require("../util/database").getDb;

module.exports = class RawFile {
    
    constructor(fileName, type, path, uploadDate) {
        this.fileName = fileName;
        this.type = type;
        this.path = path;
        this.uploadDate = uploadDate;
    }

    save(){
        const db = getDb();
        this.uploadDate = new Date(Date.now()).toISOString();
        return db.collection('rawfile').insertOne(this)
            .then(result => {
                true;
            })
            .catch(e => {
                console.log(e);
                0;
            });
    }
}