const getDb = require("../util/database").getDb;
const path = require("path");
// const db = getDb();
let date = Date.now();

module.exports = class Research {

    constructor(firstName, lastName, description, file, metadataFile, rawFile, submissionType) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.metadataFile = metadataFile;
        this.rawFile = rawFile;
        this.submissionType = submissionType
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
                return result;
            })
            .catch(e => {
                console.log(e)
                throw e;
            })

    }
    static getDarwin(type) {
        const db = getDb();
        return db.collection("darwins")
        .find({},"museum -_id")
        .toArray()
        .then(result => {
            return result
            // console.log(result)
        })
        .catch(e => {
                console.log(e)
                throw e;
            })
            
    }
}



// ['fileName', 'institutionCode', 'collectionCode',
//  'catalogNumber', 'class', 'order', 'family', 'genus', 'specificEpithet', 'infraspecificEpithet', 'sex',
// 'lifeStage', 'country', 'lifeStage', 'decimalLatitude', 'decimalLongitude', 'geodeticDatum', 
// 'verbatimElevation', 'eventDate', 'measurementDeterminedDate', 'Patch', 'LightAngle1', 'LightAngle2', 
// 'ProbeAngle1']
// ['fileName', 'institutionCode', 'catalogNumber', 'genus', 'specificEpithet', 'Patch', 'LightAngle1', 'LightAngle2', 
// 'ProbeAngle1', 'ProbeAngle2', 'Replicate']
// [
//     {fileName:{required: true}},
//     {institutionCode:{required: true}},
//     {collectionCode:{required: false}},
//     {catalogNumber:{required: true}},
//     {class:{required: false}},
//     {order:{required: false}},
//     {family:{required: false}},
//     {genus:{required: true}},
//     {specificEpithet:{required: true}},
//     {infraspecificEpithet:{required: false}},
//     {sex:{required: false}},
//     {lifeStage:{required: false}},
//     {country:{required: false}},
//     {lifeStage:{required: false}},
//     {decimalLatitude:{required: false}},
//     {decimalLongitude:{required: false}},
//     {geodeticDatum:{required: false}},
//     {verbatimElevation:{required: false}},
//     {eventDate:{required: false}},
//     {measurementDeterminedDate:{required: false}},
//     {Patch:{required: true}},
//     {LightAngle1:{required: true}},
//     {LightAngle2:{required: true}},
//     {ProbeAngle1:{required: true}},
//     {ProbeAngle2:{required: true}},
//     {Replicate:{required: true}},
//     {Comments:{required: false}},
// ]