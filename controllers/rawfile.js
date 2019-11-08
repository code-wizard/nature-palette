const rawFileModel = require("../models/rawfile");
const StreamZip = require('node-stream-zip');


exports.uploadRawFile = function (zipFilePath, submissionInfo, metaDataInfo) {

    const zip = new StreamZip({
        file: zipFilePath,
        storeEntries: true
    });

    zip.on('ready', () => {
        for (const entry of Object.values(zip.entries())) {
            if (!entry.isDirectory) {
                rawFile = new rawFileModel();
                rawFile.fileName = entry.name;
                rawFile.type = submissionInfo.typeOfData;
                rawFile.path = zipFilePath;
                new Promise((resolve, reject) => {
                    resolve(rawFile.save());
                });
            }
        }
        zip.close()
    });

}