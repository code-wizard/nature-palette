const getDb = require("../util/database").getDb;
var ObjectID = require("mongodb").ObjectID;
const _ = require("lodash")

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
        .then((result)=>{
            console.log("saved rawfiles")
        })
        .catch((err)=>{
            console.log("Hello world error", err)
        })
    }
    save(){
        const db = getDb();
        
        db.collection('rawfile').insertOne(this)
            .then(result => {
                true;
            })
            .catch(e => {
                console.log(e);
                0;
            });
    }

    static getListOfRawFileByMetaDataIdList(metaDataList){

        const db = getDb();
        // console.log('metadatalist:' ,metaDataList)
        var metaDataIdList = _.map(metaDataList, "_id");

        var inCondition = {};
        inCondition["$in"] = [];

        metaDataIdList.forEach(function (metaDataId) {
            inCondition["$in"].push(ObjectID(metaDataId));
        });

        // returns rawfile list
        return db
                .collection('rawfile')
                .find({
                    // TODO metadata will change with metadataId
                    metadata: (inCondition = inCondition["$in"].length ? inCondition : -1)
                })
                .toArray()
                .then(result => {
                    return result
                })
                .catch(e => {
                    console.log(e);
                    throw e;
                });
    }
}