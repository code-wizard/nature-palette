const getDb = require("../util/database").getDb;

module.exports = class MetaData {

    constructor(submissionId, institutionCode, collectionCode, catalogNumber, genus, specificEpithet, infraspecificEpithet, sex, country, part, replicate) {
        this.submissionId = submissionId;
        this.institutionCode = institutionCode;
        this.collectionCode = collectionCode;
        this.catalogNumber = catalogNumber;
        this.genus = genus;
        this.specificEpithet = specificEpithet;
        this.infraspecificEpithet = infraspecificEpithet;
        this.sex = sex;
        this.country = country;
        this.part = part;
        this.replicate = replicate;
    }
    static saveMany(list){
        const db = getDb()
        return db.collection("metadata").insertMany(list)
        
    }
    save() {
        const db = getDb();
        return db.collection('metadata').insertOne(this)
            .then(result => {
                true;
            })
            .catch(e => {
                console.log(e);
                false;
            });
    }

    static getListOfMetaDataFileBySubmissionId(submissionId) {
        const db = getDb();
        return db.collection('metadata')
            .find({ submissionId: submissionId })
            .toArray()
            .then(result => {
                return result;
            })
            .catch(e => {
                console.log(e)
                throw e;
            })
    }

    static getListOfMetaDataFile() {
        const db = getDb();
        return db.collection('metadata')
            .find()
            .toArray()
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(e => {
                console.log(e)
                throw e;
            })
    }
}