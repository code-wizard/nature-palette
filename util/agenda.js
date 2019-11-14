const fileFuncs = require("./file_functions")
const Agenda = require("agenda")
const fs = require("fs")
const _ = require("lodash")

const agenda = new Agenda({db: {address: 'mongodb+srv://cjamaefula:dinma1990@cluster0-ck9mx.mongodb.net/nature-palette', collection: 'agendaJobs', options: { useNewUrlParser: true }}});

readRawFiles = (submission, csvPath, rawFilePath, submissionId, required,  res)=>{
    let index = 0
    errorrMessage = []
    fileNames = []
    metaData = []
    // const required = []
    // filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    // filepath = "data-files/2019-11-06T15:31:22.845Z-2019.09.19 Example of Metadata file limited Darwin core terms.csv"

    agenda.define("processRawFile", {concurrency: 1}, async (job) => {
        const stream = fileFuncs.readRows(csvPath, {
            mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
          })
        // const stream = fs.createReadStream(filepath, 'utf8')
        // .pipe(csv({
        //     mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
        //   }))
        stream.on("headers", (headers) => {
            
        })
        .on('data', (row) => {
            
            flag = false
            for (h of required) {
                // console.log(row[h])
                if(!row[h])  {
                    errorrMessage.push({message: row[h] + " is missing a value  at row no " + parseInt(index + 1)})
                    console.log("failed", index)
                    flag = true
                    break;
                }
                //if all required row contains a value, add the row to valid rows
                
            }
            if(!flag) {
                // store metadata file name for valid metadata
                fileNames.push(row["filename"])
            }
            row["submissionId"] = submissionId;
            row["_id"] = index +"-"+submissionId + Date.now() + row.filename 
            console.log(row["_id"], row.filename )
                
            row["flag"] = flag;
            metaData.push(row)
            // }
            index++
            // console.log(row)
        })
        .on("end", () => {
            // console.log(errorrMessage, "error messages Done")
            // console.log("Done", metaData)
            console.log("Done", metaData.length, "Out")
            fileFuncs.unzipFile(submission, rawFilePath,errorrMessage, metaData, fileNames)
            
            
        })
        // fileFuncs.unzipFile(rawFilePath, metaData.length, fileNames)
    })
    // console.log(agenda)
    agenda.now('processRawFile', storeFiles)
}

storeFiles = () =>{
    filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    fs.createReadStream(filepath)
        .pipe(unzip.Extract({ path: 'data-files/unzip' }));
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
