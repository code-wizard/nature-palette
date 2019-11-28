const getDb = require("../util/database").getDb;
var ObjectID = require("mongodb").ObjectID;
const _ = require("lodash");
const MetaDataModel = require('../models/metadata')

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
        this.statusValid = false;
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

    static updateStatusValidById(submissionId) {
        const db = getDb();
        var myquery = {
            _id: submissionId
        };
        var newvalues = {
            $set: {
                statusValid: true
            }
        };
        return db
            .collection("submission")
            .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("submission updated");
            })
    }

    static getByMetaDataFilter(metaDataInfo) {

        var response = [];

        var metadataquery = {};
        metadataquery["$and"] = [];

        var submissionquery = {};
        submissionquery["$in"] = [];

        var newquery = {}
        
        var query = []
        var obj = {}

        if (metaDataInfo['searchKeyword'] != undefined) {

            newquery['$or'] = []
            var keywordstr = metaDataInfo['searchKeyword']            
            var properties = Object.keys(new MetaDataModel())
            
            _.split(keywordstr, ' and ').forEach(function (element) {

                if (element.includes(' not ')) {
                    var notayri = _.split(element, ' not ')
                    var firstand = _.split(notayri[0], ':')

                    var andfield = firstand[0] == undefined ? firstand[0] : firstand[0].trim()
                    var andvalue = firstand[1] == undefined ? firstand[1] : firstand[1].trim()
                    var andattr = _.find(properties, (v) => v.toLowerCase() == andfield.toLowerCase())
                   
                    obj[andattr] = andvalue
                    
                    notayri.shift()
                    notayri.forEach(function (not) {
                        var notword = _.split(not, ':')
                        var notfield = notword[0] == undefined ? notword[0] : notword[0].trim()
                        var notvalue = notword[1] == undefined ? notword[1] : notword[1].trim()
                        var notattr = _.find(properties, (v) => v.toLowerCase() == notfield.toLowerCase())
                        obj[notattr] = {
                            '$ne': notvalue
                        }
                        
                    })
                } else {
                    var andword = _.split(element, ':')
                    
                    var andfield2 = andword[0] == undefined ? andword[0] : andword[0].trim()
                    var andvalue2 = andword[1] == undefined ? andword[1] : andword[1].trim()
                    var andattr2 = _.find(properties, (v) => v.toLowerCase() == andfield2.toLowerCase())                    
                    obj[(andattr2)] = andvalue2
                }

            })
            newquery['$or'].push(obj)

        }
        

        Object.keys(metaDataInfo).forEach(function (attrname) {

            if (metaDataInfo[attrname] != undefined & attrname != 'searchKeyword') {
                
                // creates attribute name object for query
                obj[attrname] = {}

                // incoming search string for attribute
                var incominstr = metaDataInfo[attrname]

                // yalin 
                // replaces space ' ' with empty '' then if the search string contains minus (-) it creates 'not in' array
                // else it creates 'in' array
                // no need to delete because if string doesnt have minus no need to add array
                // if we add next foreach above we can overwrite array so..
                _.split(incominstr, 'or ').forEach(function (element) {
                    if (element.includes('not ')) {
                        obj[attrname]['$not'] = {}
                        obj[attrname]['$not']['$in'] = []
                    } else {
                        obj[attrname]['$in'] = []
                    }
                })

                // again it checks incoming string if it has minus adds to not in query
                // else adds to in query for specific attribute 
                _.split(incominstr, 'or ').forEach(function (element) {
                    if (element.includes('not ')) {
                        obj[attrname]['$not']['$in'].push(element.replace('not ', '').trim())
                    } else {
                        obj[attrname]['$in'].push(element.trim())
                    }
                })
                
            }

        
        });

        const db = getDb();
        var getSubmissionIds = new Promise((resolve, reject) => {
            db.collection("metadata")
                .find(
                    obj
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
                        Array.empty),
                    statusValid: true
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