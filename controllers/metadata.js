const csv = require('csv-parser');
const fs = require('fs');
const metaDataModel = require("../models/metadata");

exports.uploadMetaData = function(mdata){

    mdata.forEach(data => {
           
            var stringMetaData = JSON.stringify(data);
            var parsedMetaData = JSON.parse(stringMetaData);
           
            metaData = new metaDataModel();
            metaData.submissionId = parsedMetaData.submissionId;
            metaData.institutionCode = parsedMetaData.institutionCode;
            metaData.collectionCode = parsedMetaData.collectionCode;
            metaData.catalogNumber = parsedMetaData.catalogNumber;
            metaData.genus = parsedMetaData.genus;
            metaData.specificEpithet = parsedMetaData.specificEpithet;
            metaData.infraspecificEpithet = parsedMetaData.infraspecificEpithet;
            metaData.sex = parsedMetaData.sex;
            metaData.country = parsedMetaData.country;
            metaData.part = parsedMetaData.part;
            metaData.replicate = parsedMetaData.replicate;

            metaData.save();
        });
}

module.exports.getListOfMetaDataFileBySubmissionId = (req, res, next) => {
    metaDataModel.getListOfMetaDataFileBySubmissionId(req.submissionId != 0 ? req.submissionId : 0)
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


