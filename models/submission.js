const getDb = require("../util/database").getDb;
var ObjectID = require("mongodb").ObjectID;
const _ = require("lodash");

module.exports = class Submission {
    constructor(
        firstName,
        lastName,
        description,
        email,
        institutionAffiliation,
        typeOfData,
        dataFrom,
        published,
        reference,
        doi,
        embargo,
        releaseDate,
        metaDataFileName,
        recordDate,
        statusValid
    ) {
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
        return db
            .collection("submission")
            .insertOne(this)
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
        return db
            .collection("submission")
            .find( /*{statusValid : true}*/ ) // will change when validation comes
            .toArray()
            .then(result => {
                return result;
            })
            .catch(e => {
                console.log(e);
                throw e;
            });
    }

    static getByMetaDataFilter(metaDataInfo) {

        var response = [];

        var metadataquery = {};
        metadataquery["$and"] = [];

        var submissionquery = {};
        submissionquery["$in"] = [];

        Object.keys(metaDataInfo).forEach(function (attrname) {
            if (metaDataInfo[attrname] != undefined) {
                metadataquery["$and"].push({
                    [attrname.toLowerCase()]: metaDataInfo[attrname]
                });
            }
        });

        const db = getDb();
        var getSubmissionIds = new Promise((resolve, reject) => {
            db.collection("metadata")
                .find(
                    (metadataquery = metadataquery["$and"].length ?
                        metadataquery :
                        Array.empty)
                )
                .toArray()
                .then(result => {
                    resolve(result);
                })
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        });

        return getSubmissionIds.then(function (value) {

            response['metadatalist'] = value;

            var submissionIdList = _.uniq(
                _.map(value, "submissionId"),
                "submissionId"
            );

            submissionIdList.forEach(function (submissionIdItem) {
                submissionquery["$in"].push(ObjectID(submissionIdItem));
            });

            return db
                .collection("submission")
                .find({
                    _id: (submissionquery = submissionquery["$in"].length ?
                        submissionquery :
                        Array.empty)
                })
                .toArray()
                .then(result => {
                    response['submissionlist'] = result;
                    return response
                })
                .catch(e => {
                    console.log(e);
                    throw e;
                });
        });
    }
};