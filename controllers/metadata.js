const csv = require('csv-parser');
const fs = require('fs');
const metaDataModel = require("../models/metadata");
const rawDataController = require("../controllers/rawfile");

exports.uploadMetaData = function (mdata, submissionInfo, rawDataFilePath) {

    mdata.forEach(data => {

        var stringMetaData = JSON.stringify(data);
        var parsedMetaData = JSON.parse(stringMetaData);

        metaData = new metaDataModel();
        metaData.fileName = parsedMetaData.FileName;
        metaData.submissionId = parsedMetaData.submissionId;
        metaData.uniqueId = parsedMetaData.uniqueId;
        metaData.className = parsedMetaData.className;
        metaData.order = parsedMetaData.order;
        metaData.family = parsedMetaData.family;
        metaData.institutionCode = parsedMetaData.institutionCode;
        metaData.collectionCode = parsedMetaData.collectionCode;
        metaData.catalogNumber = parsedMetaData.catalogNumber;
        metaData.genus = parsedMetaData.genus;
        metaData.specificEpithet = parsedMetaData.specificEpithet;
        metaData.infraspecificEpithet = parsedMetaData.infraspecificEpithet;
        metaData.sex = parsedMetaData.sex;
        metaData.lifeStage = parsedMetaData.lifeStage;
        metaData.country = parsedMetaData.country;
        metaData.locality = parsedMetaData.locality;
        metaData.decimalLatitude = parsedMetaData.decimalLatitude;
        metaData.decimalLongitude = parsedMetaData.decimalLongitude;
        metaData.geodeticDatum = parsedMetaData.geodeticDatum;
        metaData.verbatimElevation = parsedMetaData.verbatimElevation;
        metaData.eventDate = parsedMetaData.eventDate;
        metaData.measurementDetermineDate = parsedMetaData.measurementDetermineDate;
        metaData.patch = parsedMetaData.patch;
        metaData.lightAngle1 = parsedMetaData.lightAngle1;
        metaData.lightAngle2 = parsedMetaData.lightAngle2;
        metaData.probeAngle1 = parsedMetaData.probeAngle1;
        metaData.probeAngle2 = parsedMetaData.probeAngle2;
        metaData.replicate = parsedMetaData.replicate;
        metaData.comments = parsedMetaData.comments;

        new Promise((resolve, reject) => {
                resolve(metaData.save());
            })
            .then(result => {
                rawDataController.uploadRawFile(rawDataFilePath, submissionInfo, metaData);
            })
    });
}

module.exports.getListOfMetaDataFile = (req, res, next) => {
    metaDataModel.getListOfMetaDataFile()
        .then(metaDataResult => {
            res.render('metadatalist', {
                title: "Meta Data List",
                metadatafiles: metaDataResult
            })
        })
        .catch(err => {
            console.log(err)
        });

}