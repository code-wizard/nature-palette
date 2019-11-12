const csv = require("csv-parser")
const fs = require("fs")
const _ = require("lodash")
const StreamZip = require("node-stream-zip")
const RawFile = require("../models/rawfile");
const MetaData = require("../models/metadata")
// const processRawFiles = require("../util/agenda")
const rOperation = require("r-script");

// const rScriptPath = './util/calcMetrics.R';
const rScriptPath = './util/deneme.R';

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
    //hold the name of the zipped folder
    let zipdirName 
    zip.on('ready', () => {
        rawFiles = []
        if(zip.entriesCount-1 !== fileNames.length){
            //  console.log("entered here", fileNames)
            errorrMessage.push({message: "Metadata filenames does not match the number of raw files uploaded. Only matching files will be released"})
            //send email to client with error messages
            return
        }
        const dirName = 'data-files/raw-files-output/' + metadata[0].submissionId
        fs.mkdir('data-files/raw-files-output/' + metadata[0].submissionId, { recursive: true }, (err) => {
            //throws error if unable to create director
            if (err) throw err;

            for (const  [index, [, entry]] of Object.entries(Object.entries(zip.entries()))) {
                // console.log(index, entry)
                // const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                if (!entry.isDirectory){
                    i++
                    let filename = _.replace(entry.name, zipdirName, "")
                    if (entry.name.includes(fileNames[i])) {
                            // console.log("File exists", i, entry.name,dirName,"fdfdfd", _.replace(entry.name, dirName, ""))
                            
                            // console.log(dirName, "Meta data")
                            let dirPath = dirName+"/"+filename;
                            metadata[i]["valid"] = true
                            rawFiles.push({
                                metadata: metadata[i]._id,
                                path: dirPath,
                                type: '',
                                fileName: filename
                            })
                            zip.extract(entry.name, dirPath, err=>{
                                // console.log(entry.name, "Nand", dirPath, "Couldn't")
                                // errorrMessage.push({message:  " Could not read "+filename})
                            })
                    } else {
                        errorrMessage.push({message: filename+ " was not released. No matching metadata row"})
                        // remove the meta data without a matching file
                        metadata[i]["valid"] = false
                        // console.log("No way!")
                        continue
                    }

                    // raw files R script check
                    rScriptTrigger(filename)
                    
                } else {
                    zipdirName = entry.name
                    i = index - 1
                }
                // console.log(`Entry ${entry.name}: ${desc}`);
            }
            // console.log(rawFiles, "Here")
            // Note to self, try moving the saving of metadata and raw to a new background process after the 
            // Validation is done 
            try{
                MetaData.saveMany(metadata.filter((item)=>{return item.valid}))
                // console.log("done saving", metadata.filter((item)=>item.valid))
                RawFile.saveMany(rawFiles)
                // console.log("Saving Rawfiles done", rawFiles)
                // Send email to client with list of errors
            } catch(err){
                console.log("error saving metadata", err)
            }

          });
        
        // try{
        //     MetaData.saveMany(metadata)
        //     console.log("done saving")
        // } catch(err){
        //     console.log("error saving metadata", err)
        // }
        // try{
        //     RawFile.saveMany(rawFiles)
        // } catch(err){
        //     console.log("error saving raw file", err)
        // }
        
        // Do not forget to close the file once you're done
        
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


function rScriptTrigger(rawFilePath) {

    new Promise((resolve, reject) => {
        rOperation(rScriptPath)
            .data({
                rawFilePath : rawFilePath
            })
            .call(function (err, d) {
                if (err) throw err;
                resolve(d)
            })
    }).then(function (value) {

        // prints out result of R script - value
        console.log(value);

        // TODO : will check metrics then inform user
    });
}