const csv = require("csv-parser")
const fs = require("fs")
const _ = require("lodash")
const StreamZip = require("node-stream-zip")
const RawFile = require("../models/rawFile");
const MetaData = require("../models/metadata")
// const processRawFiles = require("../util/agenda")

const readRows = (filepath, option) => {
    // filepath = "data-files/2019-11-06T15:31:22.845Z-2019.09.19 Example of Metadata file limited Darwin core terms.csv"
    let array = []
    stream = fs.createReadStream(filepath, 'utf8')
        .pipe(csv(option))
    
    return stream
    
}

const unzipRawFiles = (filepath, errorrMessage, metadata, fileNames)=>{
    // processRawFiles.readRawFiles("")
    // filepath = "data-files/2019-11-06T15:31:22.850Z-2019.09.19 Example raw files.zip"
    const zip = new StreamZip({
        file: filepath,
        storeEntries: true
    });
    //hold the name of the folder
    let dirName 
    zip.on('ready', () => {
        rawFiles = []
        if(zip.entriesCount-1 !== fileNames.length){
            errorrMessage.push({message: "Metadata filenames does not match the number of raw files uploaded. Only matching files will be released"})
        }
        for (const  [index, [, entry]] of Object.entries(Object.entries(zip.entries()))) {
            // console.log(index, entry)
            const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
            if (!entry.isDirectory){
                i++
                console.log(fileNames[i], entry.name)
                if (entry.name.includes(fileNames[i])) {
                        // console.log("File exists", i, entry.name,dirName,"fdfdfd", _.replace(entry.name, dirName, ""))
                        let filename = _.replace(entry.name, dirName, "")
                        let dirPath = 'data-files/raw-output/'+filename;
                        rawFiles.push({
                            metadata: metadata[i]._id,
                            path: dirPath,
                            type: '',
                            fileName: filename
                        })
                        zip.extract(entry.name, dirPath, err=>{
                            errorrMessage.push({message:  " Could not read "+filename})
                        })
                } else {
                    errorrMessage.push({message: filename+ " was not released. No matching metadata row"})
                }
            } else {
                dirName = entry.name
                i = index - 1
            }
            // console.log(`Entry ${entry.name}: ${desc}`);
        }
        MetaData.saveMany(metadata)
        .then(
            (result)=>{
                RawFile.saveMany(rawFiles)
                then((rawResult)=>{
                    console.log("saved raw file")
                })
                .catch((err)=>{
                    console.log("error saving raw file", err)
                })
            }
        )
        .catch((err)=>{
            console.log("error saving metadata", err)
        })
        
        // Do not forget to close the file once you're done
        console.log(errorrMessage)
        // zip.close()
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
const fieldData = ()=> {
    return ["FileName","UniqueID","genus","specificEpithet","Patch","LightAngle1","LightAngle2","ProbeAngle1","ProbeAngle2","Replicate"]
}
const museumData = ()=> {
    return ['fileName', 'institutionCode']
    // return ['fileName', 'institutionCode', 
    // 'catalogNumber', 'genus', 'specificEpithet', 'Patch', 'LightAngle1', 'LightAngle2', 
    // 'ProbeAngle1', 'ProbeAngle2', 'Replicate']
}
module.exports = {
    readRows: readRows,
    unzipFile: unzipRawFiles,
    museumData: museumData,
    fieldData: fieldData
}

// FIELD - Reflectance
// FileName*,UniqueID*,class,order,family,genus*,specificEpithet*,infraspecificEpithet,sex,lifeStage,country,locality,decimalLatitude,decimalLongitude,geodeticDatum,verbatimElevation,eventDate,measurementDeterminedDate,Patch*,LightAngle1*,LightAngle2*,ProbeAngle1*,ProbeAngle2*,Replicate*,Comments


// Darwin Core:
// class,order,family,genus*,specificEpithet*,infraspecificEpithet,sex,lifeStage,country,locality,decimalLatitude,decimalLongitude,geodeticDatum,verbatimElevation,eventDate,measurementDeterminedDate

// Mandatory Fields:
// ["FileName","UniqueID","genus","specificEpithet","Patch","LightAngle1","LightAngle2","ProbeAngle1","ProbeAngle2","Replicate"]