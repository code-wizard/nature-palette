const fileFuncs = require("./file_functions")
const Agenda = require("agenda")
const fs = require("fs")
const _ = require("lodash")

// const agenda = new Agenda({db: {address: 'mongodb+srv://cjamaefula:dinma1990@cluster0-ck9mx.mongodb.net/nature-palette', collection: 'agendaJobs', options: { useNewUrlParser: true }}});

readRawFiles = (filePath, required)=>{
    let index = 0
    missingRequiredFieldValue = []
    fileNames = []
    metaData = []
    // const required = []
    // filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    filepath = "data-files/2019-11-06T15:31:22.845Z-2019.09.19 Example of Metadata file limited Darwin core terms.csv"

    // agenda.define("processRawFile", async (job) => {
        const stream = fileFuncs.readRows("data-files/", {
            mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
          })
        // const stream = fs.createReadStream(filepath, 'utf8')
        // .pipe(csv({
        //     mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
        //   }))
        stream.on("headers", (headers) => {
            console.log(headers)
            console.log("Hello Space Ship")
            console.log(required)
        })
        .on('data', (row) => {
            fileNames.push(row["filename"])
            metaData.push(row)
            for (h of required) {
                // console.log(row[h])
                if(!row[h])  {
                    missingRequiredFieldValue.push(index)
                }
            }
            index++
            // console.log(row)
        })
        .on("end", () => {
            // console.log(data, "Done")
            console.log("Done")
            
        })
        fileFuncs.unzipFile("fdfd", metaData.length, fileNames)
    // })
    
    // console.log(agenda)
}

storeFiles = () =>{
    filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    fs.createReadStream(filepath)
        .pipe(unzip.Extract({ path: 'data-files/unzip' }));
}
// agenda.on( "ready", function() {
//     agenda.start()
//     agenda.now('processRawFile', storeFiles)
//     // .then( (data)=>{
//     //     console.log("done", data)
//     //     storeFiles()
//     // })
//   })

module.exports = {
    readRawFiles: readRawFiles
}
