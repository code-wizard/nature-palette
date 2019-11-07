const csv = require('csv-parser');
const fs = require('fs');
const submissionModel = require("../models/submission");
const metaDataController = require("../controllers/metadata");

module.exports.uploadSubmission = (req, res) => {

    const body = req.body;

    submission = new submissionModel();
    submission.firstName = body.firstName;
    submission.lastName = body.lastName;
    submission.description = body.description;
    submission.email = body.email;
    submission.institutionAffiliation = body.institutionAffiliation;
    submission.typeOfData = body.typeOfData;
    submission.dataFrom = body.dataFrom;
    submission.published = body.published;
    submission.reference = body.reference;
    submission.embargo = body.embargo;
    submission.metaDataFile = req.file;
    // submission.statusValid = false; // will change when validation comes
    submission.save();

    var filePath = submission.metaDataFile.path;

    var promiseReadCsv = new Promise((resolve, reject) => {
        var results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            });
    });

    promiseReadCsv.then(function (value) {
        var contentOfMetaDataFile = value;
        metaDataController.uploadMetaData(contentOfMetaDataFile);
    })

    // kaydet
    res.redirect("/list-files");
}

exports.getListSubmission = (req, res, next) => {
    submissionModel.getAll()
        .then(submissionResponse => {
            res.render('list', {
                title: "All Research Files",
                researches: submissionResponse
            })
        })
        .catch(err => {
            console.log(err)
        })
}