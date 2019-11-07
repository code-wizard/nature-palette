const rawFileModel = require("../models/rawFile");

exports.uploadRawFile = function(data){

    rawFile = new rawFileModel();
    rawFile.firstName = data.firstName;
    rawFile.lastName = data.lastName;
    rawFile.description = data.description;
    rawFile.email = data.email;
    rawFile.institutionAffiliation = data.institutionAffiliation;
    rawFile.typeOfData = data.typeOfData;
    rawFile.dataFrom = data.dataFrom;
    rawFile.published = data.published;
    rawFile.reference = data.reference;
    rawFile.embargo = data.embargo;
    rawFile.metaDataFile = req.file;
    rawFile.save();   
}