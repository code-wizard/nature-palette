const csv = require('csv-parser');
const fs = require('fs');
const submissionModel = require("../models/submission");
const metaDataController = require("../controllers/metadata");

module.exports.uploadSubmission = (req, res) => {

    const body = req.body;
    const metaDataFile = req.files["metadataFile"][0];
    const rawDataZipFile = req.files["rawFile"][0];

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
    submission.metaDataFile = metaDataFile;
    // submission.statusValid = false; // will change when validation comes

    // save submission to db
    var insertedSubmissionId;
    var savePromise = new Promise((resolve, reject) => {
        resolve(submission.save());
    });

    savePromise.then(function (value) {
        insertedSubmissionId = value;

        // reading metadata file
        var filePath = submission.metaDataFile.path;
        new Promise((resolve, reject) => {
            var results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        }).then(function (value) {

            // after read, insert meta data file list
            var contentOfMetaDataFile = value;
            contentOfMetaDataFile.forEach(element => {
                element.submissionId = insertedSubmissionId;
            });
            metaDataController.uploadMetaData(contentOfMetaDataFile, submission, rawDataZipFile.path);
        })
    });

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