const getDb = require("../util/database").getDb;
var ObjectID = require("mongodb").ObjectID;

module.exports = class MetaData {

    constructor(fileName,
        submissionId,
        uniqueId,
        className,
        order,
        family,
        institutionCode,
        collectionCode,
        catalogNumber,
        genus,
        specificEpithet,
        infraspecificEpithet,
        sex,
        lifeStage,
        country,
        locality,
        decimalLatitude,
        decimalLongitude,
        geodeticDatum,
        verbatimElevation,
        eventDate,
        measurementDeterminedDate,
        patch,
        lightAngle1,
        lightAngle2,
        probeAngle1,
        probeAngle2,
        replicate,
        comments) {

        this.fileName = fileName;
        this.submissionId = submissionId;
        this.uniqueId = uniqueId;
        this.className = className;
        this.order = order;
        this.family = family;
        this.institutionCode = institutionCode;
        this.collectionCode = collectionCode;
        this.catalogNumber = catalogNumber;
        this.genus = genus;
        this.specificEpithet = specificEpithet;
        this.infraspecificEpithet = infraspecificEpithet;
        this.sex = sex;
        this.lifeStage = lifeStage;
        this.country = country;
        this.locality = locality;
        this.decimalLatitude = decimalLatitude;
        this.decimalLongitude = decimalLongitude;
        this.geodeticDatum = geodeticDatum;
        this.verbatimElevation = verbatimElevation;
        this.eventDate = eventDate;
        this.measurementDeterminedDate = measurementDeterminedDate;
        this.patch = patch;
        this.lightAngle1 = lightAngle1;
        this.lightAngle2 = lightAngle2;
        this.probeAngle1 = probeAngle1;
        this.probeAngle2 = probeAngle2;
        this.replicate = replicate;
        this.comments = comments;
    }
    static saveMany(list){
        const db = getDb()
        return db.collection("metadata").insertMany(list)
        .then(result=> {
            console.log("hellow world")
        })
        .catch((err)=>{
            console.log("hellow world", err)
        })
        
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
            .find({
                submissionId: ObjectID(submissionId)
            })
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