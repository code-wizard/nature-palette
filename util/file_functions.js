const csv = require("csv-parser")
const fs = require("fs")
const StreamZip = require("node-stream-zip")
// const processRawFiles = require("../util/agenda")

const readRows = (filepath, option) => {
    filepath = "data-files/2019-11-06T15:31:22.845Z-2019.09.19 Example of Metadata file limited Darwin core terms.csv"
    let array = []
    stream = fs.createReadStream(filepath, 'utf8')
        .pipe(csv(option))
    
    return stream
    
}

const unzipRawFiles = (filepath, metadataLength, fileNames)=>{
    // processRawFiles.readRawFiles("")
    filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    const zip = new StreamZip({
        file: filepath,
        storeEntries: true
    });
    zip.on('ready', () => {
        console.log('Entries read: ' + zip.entriesCount, fileNames.length);
        if(zip.entriesCount-1 !== fileNames.length){
            console.log("Metadata filenames does not match the number of raw files uploaded")
        }
        for (const  [index, [, entry]] of Object.entries(Object.entries(zip.entries()))) {
            // console.log(index, entry)
            const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
            if (!entry.isDirectory){
                i++
                console.log(fileNames[i], entry.name)
                if (entry.name.includes(fileNames[i])) {
                        console.log("File exists", i)
                }
            } else {
                i = index - 1
            }
            // console.log(`Entry ${entry.name}: ${desc}`);
        }
        // Do not forget to close the file once you're done
        zip.close()
    });
    // let index = 0
    // fs.createReadStream(filepath)
    // .pipe(unzip.Parse())
    // .on('entry', function (entry) {
    //     var fileName = entry.path;
    //     var type = entry.type; // 'Directory' or 'File'
    //     var size = entry.size;
    //     console.log(index++, fileName)
    //     // if (fileName === "this IS the file I'm looking for") {
    //     // entry.pipe(fs.createWriteStream('output/path'));
    //     // } else {
    //     // entry.autodrain();
    //     // }
    // });
}
module.exports = {
    readRows: readRows,
    unzipFile: unzipRawFiles
}