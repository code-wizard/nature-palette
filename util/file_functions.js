const csv = require("csv-parser")
const fs = require("fs")
const archiver = require('archiver')
const _ = require("lodash")
const StreamZip = require("node-stream-zip")
const path = require("path")
const rOperation = require("r-script")
const {
    convertArrayToCSV
} = require('convert-array-to-csv');


const RawFile = require("../models/rawfile")
const MetaData = require("../models/metadata")
const emails = require("./emails")


// const rScriptPath = './util/calcMetrics.R';
const rScriptPath = './util/deneme.R';

const readRows = (filepath, option) => {
    // filepath = "data-files/2019-11-06T15:31:22.845Z-2019.09.19 Example of Metadata file limited Darwin core terms.csv"
    let array = []
    stream = fs.createReadStream(filepath, 'utf8')
        .pipe(csv(option))

    return stream

}

const unzipRawFiles = (submission, filepath, errorrMessage, metadata, fileNames) => {
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
        // Contains metadata with corresponding raw files
        validFilesNames = metadata.filter((item) => {
            return !item.flag
        })
        if (zip.entriesCount - 1 !== fileNames.length) {
            console.log("entered here")
            errorrMessage.push({
                message: "Metadata filenames does not match the number of raw files uploaded. Only valid metadata will be released"
            })
            //send email to client with error messages
            // return
        }
        const dirName = 'data-files/raw-files-output/' + validFilesNames[0].submissionId
        fs.mkdir('data-files/raw-files-output/' + validFilesNames[0].submissionId, {
            recursive: true
        }, (err) => {
            //throws error if unable to create director
            if (err) throw err;


            for (const [index, [, entry]] of Object.entries(Object.entries(zip.entries()))) {
                // console.log(index, entry)
                // const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                if (!entry.isDirectory) {
                    i++
                    let filename = _.replace(entry.name, zipdirName, "")
                    if (entry.name.includes(fileNames[i])) {
                        // console.log("File exists", i, entry.name,dirName,"fdfdfd", _.replace(entry.name, dirName, ""))

                        // console.log(dirName, "Meta data")
                        let dirPath = dirName + "/" + filename;
                        metadata[i]["valid"] = true
                        rawFiles.push({
                            metaDataId: metadata[i]._id,
                            path: dirPath,
                            type: '',
                            fileName: filename
                        })
                        zip.extract(entry.name, dirPath, err => {
                            // console.log(entry.name, "Nand", dirPath, "Couldn't")
                            // errorrMessage.push({message:  " Could not read "+filename})
                        })
                    } else {
                        errorrMessage.push({
                            message: filename + " was not released. No matching metadata row"
                        })
                        // remove the meta data without a matching file
                        metadata[i]["valid"] = false
                        // console.log("No way!")
                        continue
                    }

                } else {
                    zipdirName = entry.name
                    i = index - 1
                }
                // console.log(`Entry ${entry.name}: ${desc}`);
            }
            // console.log(rawFiles, "Here")
            // Note to self, try moving the saving of metadata and raw to a new background process after the 
            // Validation is done 
            try {
                // MetaData.saveMany(metadata.filter((item)=>{return item.valid}))
                MetaData.saveMany(metadata)
                console.log("done saving")
                RawFile.saveMany(rawFiles)
                console.log("Saving Rawfiles done")
                let message = emails.successMesg(submission);
                if (errorrMessage.length) {
                    message = emails.prepareErrorMessageHTML(errorrMessage, submission)
                }
                emails.sendEmail(submission.email, message)
                // Send email to client with list of errors
            } catch (err) {
                console.log("error saving metadata", err)
            }

        });

    });

}
const fieldData = () => {
    return ["FileName", "UniqueID", "genus", "specificEpithet", "Patch", "LightAngle1", "LightAngle2", "ProbeAngle1", "ProbeAngle2", "Replicate"]
}
const museumData = () => {
    return ['fileName', 'institutionCode']
    // return ['fileName', 'institutionCode', 
    // 'catalogNumber', 'genus', 'specificEpithet', 'Patch', 'LightAngle1', 'LightAngle2', 
    // 'ProbeAngle1', 'ProbeAngle2', 'Replicate']
}

const prepareDownloadZipFile = (submissionId, metadatalist, rawfilelist, cb) => {

    var rootpath = path.dirname(require.main.filename)
    var now = Date.now().toString()
    var zipfilename = now + submissionId + '.zip'
    var csvfilename = now + submissionId + '.csv'
    var zipfilepath = path.join(rootpath, 'data-files', zipfilename)
    var csvfilepath = path.join(rootpath, 'data-files', csvfilename)
    const csvFromArrayOfObjects = convertArrayToCSV(metadatalist);

    return new Promise(function (resolve, reject) {

        var output = fs.createWriteStream(zipfilepath)
        var archive = archiver('zip')

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output)

        rawfilePathlist = rawfilelist.map(x => ({
            path: x.path,
            fileName: x.fileName
        }))

        rawfilePathlist.forEach(function (element) {
            var transmissionfilepath = path.join(rootpath, element.path)
            archive.append(fs.createReadStream(transmissionfilepath), {
                name: element.fileName
            })
        })

        new Promise((resolve, reject) => {
            fs.writeFile(csvfilepath, csvFromArrayOfObjects, function (err) {
                console.log(err);
            })
            resolve(archive.append(fs.createReadStream(csvfilepath), {
                name: csvfilename
            }))
        })

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(zipfilepath)
        });

        output.on('end', function () {
            resolve(zipfilepath)
            console.log('Data has been drained');
        });

        archive.finalize()

    })

}

module.exports = {
    readRows: readRows,
    unzipFile: unzipRawFiles,
    museumData: museumData,
    fieldData: fieldData,
    prepareDownloadZipFile: prepareDownloadZipFile
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
                    rawFilePath: rawFilePath
                })
                .call(function (err, d) {
                    if (err) throw err;
                    resolve(d)
                })
        }).then(function (value) {

            // prints out result of R script - value
            console.log(value);

            // TODO : will check metrics, if yes then make submission flag TRUE then inform user
        })
        .catch(err => {
            // send email to user that there is a problem
            console.log(err)
        });
}