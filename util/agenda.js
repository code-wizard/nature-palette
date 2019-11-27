const fileFuncs = require("./file_functions")
const Agenda = require("agenda")
const fs = require("fs")
const _ = require("lodash")
var ObjectID = require("mongodb").ObjectID;
const config = require('../config.js')
const emails = require("./emails")

const agenda = new Agenda({
    db: {
        address: global.gConfig.database,
        collection: 'agendaJobs',
        options: {
            useNewUrlParser: true
        }
    }
});

readRawFiles = (submission, csvPath, rawFilePath, metaData, fileNames ) => {
    var index = 0
    errorMessage = []
    var thereIsAMistake = false

    agenda.define("processRawFile", {
        concurrency: 1
    }, async (job) => {        
        const stream = fileFuncs.readRows(csvPath, {
            mapHeaders: ({
                header,
                index
            }) => _.replace(header.toLowerCase(), " ", "")
        })
        stream.on("headers", (headers) => {
            })
            .on('data', (row) => {
            })
            .on("end", () => {
                    fileFuncs.unzipFile(submission, rawFilePath, errorMessage, metaData, fileNames)             
            })
        // fileFuncs.unzipFile(rawFilePath, metaData.length, fileNames)
    })
    // console.log(agenda)
    agenda.now('processRawFile', (job) => {
        job.disable();
        // await job.remove()
    })
}

storeFiles = () => {
    filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    fs.createReadStream(filepath)
        .pipe(unzip.Extract({
            path: 'data-files/unzip'
        }));
}

// agenda.on( "ready", function() {
//     agenda.start()
//     agenda.now('processRawFile', storeFiles)
//     .then( (data)=>{
//         console.log("done")
//         // storeFiles()

//     })
//   })

module.exports = {
    readRawFiles: readRawFiles,
    agenda: agenda
}