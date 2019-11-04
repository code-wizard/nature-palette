const getDb = require("../util/database").getDb;
const path = require("path");
// const db = getDb();
let date = Date.now();

module.exports = class Research {

    constructor(firstName, lastName, description, file) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.file = file;
    }

    save() {
        const db = getDb();
        this.file = path.join("/", this.file.destination, this.file.filename);
        console.log(this.file)
        return db.collection("research").insertOne(this)
            .then(result => {
                // console.log(result);
            })
            .catch(e => {
                console.log(e);
            })
    }
    static fetchAll(cb) {
        const db = getDb();
        return db.collection("research")
            .find()
            .toArray()
            .then(result => {
                console.log(result, "mane")
                return result;
            })
            .catch(e => {
                console.log(e)
                throw e;
            })

    }
}