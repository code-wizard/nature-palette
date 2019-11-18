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

        var newquery = {}

        Object.keys(metaDataInfo).forEach(function (attrname) {
            if (metaDataInfo[attrname] != undefined) {

                // creates attribute name object for query
                newquery[attrname.toLowerCase()] = {}

                // incoming search string for attribute
                var incominstr = metaDataInfo[attrname]

                // yalin 
                // replaces space ' ' with empty '' then if the search string contains minus (-) it creates 'not in' array
                // else it creates 'in' array
                // no need to delete because if string doesnt have minus no need to add array
                // if we add next foreach above we can overwrite array so..
                _.split(incominstr.replace(/\s/g, ''), ',').forEach(element => {
                    if (element.startsWith('-')) {
                        newquery[attrname.toLowerCase()]['$not'] = {}
                        newquery[attrname.toLowerCase()]['$not']['$in'] = []
                    }
                    else{
                        newquery[attrname.toLowerCase()]['$in'] = []
                    }
                })
                
                // again it checks incoming string if it has minus adds to not in query
                // else adds to in query for specific attribute 
                _.split(incominstr.replace(/\s/g, ''), ',').forEach(element => {
                    if (element.startsWith('-')) {
                        newquery[attrname.toLowerCase()]['$not']['$in'].push(element.replace('-',''))
                    } else {
                        newquery[attrname.toLowerCase()]['$in'].push(element)
                    }
                })

            }
        });

        // console.log('mq: ', metadataquery)
        // console.log('yq: ', yeniquery)

        const db = getDb();
        var getSubmissionIds = new Promise((resolve, reject) => {
            db.collection("metadata")
                .find(
                    newquery
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