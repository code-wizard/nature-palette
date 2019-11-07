const getDb = require("../util/database").getDb;

module.exports = class Submission {

    constructor(firstName, lastName, description, email, institutionAffiliation, typeOfData, dataFrom, published, reference, doi, embargo, releaseDate, metaDataFileName, recordDate, statusValid) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.email = email;
        this.institutionAffiliation = institutionAffiliation;
        this.typeOfData = typeOfData;
        this.dataFrom = dataFrom;
        this.published = published;
        this.reference = reference;
        this.doi = doi;
        this.embargo = embargo;
        this.releaseDate = releaseDate;
        this.metaDataFileName = metaDataFileName;
        this.recordDate = recordDate;
        this.statusValid = statusValid;
    }

    save() {
        const db = getDb();
        this.recordDate = new Date(Date.now());
        return db.collection('submission').insertOne(this)
            .then(result => {
                return result.insertedId;
            })
            .catch(e => {
                console.log(e);
                0;
            });
    }

    static getAll() {
        const db = getDb();
        return db.collection('submission')
            .find(/*{statusValid : true}*/) // will change when validation comes
            .toArray()
            .then(result => {
                return result;
            })
            .catch(e => {
                console.log(e)
                throw e;
            })
    }

}