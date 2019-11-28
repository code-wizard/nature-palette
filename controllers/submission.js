// const csv = require('csv-parser');
const fs = require('fs')
const http = require('http')
const submissionModel = require('../models/submission')
const metaDataModel = require('../models/metadata')
const rawFileModel = require('../models/rawfile')
// const metaDataController = require("../controllers/metadata");
const fileFuncs = require("../util/file_functions")
const path = require("path")
const Research = require("../models/research")
const multer = require("multer")
const dateFn = require("date-fns")
const _ = require("lodash")
const processRawFiles = require("../util/agenda")
var ObjectID = require("mongodb").ObjectID

module.exports.uploadSubmission = (req, res) => {

    if (req.method === "POST") {
        const body = req.body;

        submission = new submissionModel();
        submission._id = new ObjectID();
        submission.firstName = body.firstName;
        submission.lastName = body.lastName;
        submission.description = body.description;
        submission.email = body.email;
        submission.institutionAffiliation = body.institutionAffiliation;
        submission.typeOfData = body.typeOfData;
        submission.dataFrom = body.dataFrom;
        submission.doi = body.doi;
        submission.releaseDate = body.releaseDate;
        submission.reference = body.reference;
        submission.published = body.published;
        submission.embargo = body.embargo;
        const metadataFile = req.files.metadataFile;
        const rawFile = req.files.rawFile;
        let missingRFields = []
        const rm = []
        const hm = []
        data = []

        if (!metadataFile || !rawFile) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                req: req,
                errorMessage: "Attach only .csv or .zip file"
            });
        } else if(["Transmittance", "Irradiance"].includes(submission.typeOfData)){
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                req: req,
                errorMessage: "We are currenly accepting only Transamittance data"
            });
        }
        else if (parseInt(submission.embargo) && !submission.releaseDate) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                req: req,
                success: false,
                errorMessage: "Please specify embargo expiry date"
            });
        } else if (submission.releaseDate && dateFn.getYear(new Date(submission.releaseDate)) < dateFn.getYear(new Date())) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                req: req,
                errorMessage: "Embargo release date must be in the future."
            });
        } else if (submission.releaseDate && dateFn.differenceInYears(new Date(), new Date(submission.releaseDate)) > 1) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                req: req,
                errorMessage: "Embargo release date must not be greater then 1 year from today."
            });
        } else if (submission.published === "yes" && !submission.doi) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                req: req,
                success: false,
                errorMessage: "Digital Object Reference is required for a published research."
            });
        } else if (submission.published === "yes" && !submission.reference) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                req: req,
                errorMessage: "Reference is required for a published research."
            });
        }

        // create a stream to read the csv
        const stream = fileFuncs.readRows(metadataFile[0].path, {
            mapHeaders: ({
                header,
                index
            }) => _.replace(header.toLowerCase(), " ", "")
        })

        // Get the required field
        if (body.dataFrom === "field")
            requireField = fileFuncs.fieldData()
        else
            requireField = fileFuncs.museumData()

        // Make metadata lower case
        for (f of requireField) {
            rm.push(f.toLocaleLowerCase())
        }

        let index = 0;
        var errorMessage = []
        var fileNames = []
        var metaData = []

        var isColumnsMatch = true
        var isCellValueMissing = true

        stream.on('headers', (headers) => {

                // validate column names
                const intersection = _.intersection(rm, headers)

                if (intersection.length != requireField.length) {
                    isColumnsMatch = false
                    missingRFields = _.difference(rm, intersection)
                    errorMessage.push({
                        message: 'Your metadata is missing some required fileds : ' + missingRFields.join()
                    })
                }
            })
            .on('data', (row) => {

                if (isColumnsMatch) {
                    // validate if required fields has value in cells
                    for (attr of requireField) {
                        if (!row[attr.toLowerCase()]) {
                            isCellValueMissing = false
                            errorMessage.push({
                                message: attr.toString() + " is missing a value  at row no " + parseInt(index + 2)
                            })
                        }
                    }

                    // filenames added to check with zip raw files
                    fileNames.push(row["filename"])

                    row["submissionId"] = submission._id;
                    row["_id"] = new ObjectID();
                    // metadata model added for list
                    metadataModel = convertMetadataLowerToCamelCase(row)
                    metaData.push(metadataModel)

                    index++
                }
            })
            .on("end", () => {
                // if there is no mistake on column names, run in background
                if (isColumnsMatch && isCellValueMissing) {

                    submission.save()
                        .then((submissionId) => {
                            processRawFiles.readRawFiles(submission, metadataFile[0].path, rawFile[0].path, metaData, fileNames)
                            res.redirect("/upload-success")
                        })
                        .catch((err) => {
                            console.log("unable to save submission", err)
                        })
                } else {
                    return res.status(422).render("submission", {
                        title: "Nature Palette - Upload",
                        hasError: true,
                        success: false,
                        req: req,
                        errorMessage: errorMessage
                    });
                }
            })
    } else {
        res.render('submission', {
            title: "Submit Research",
            hasError: false,
            success: false,
            req: req
        })
    }
    // kaydet

}


exports.getListSubmission = (req, res, next) => {

    var body = req.body

    searchMetaData = new metaDataModel();
    searchMetaData.searchKeyword = !body.searchKeyword.trim() ? undefined : body.searchKeyword;
    searchMetaData.institutionCode = !body.institutionCode.trim() ? undefined : body.institutionCode;
    searchMetaData.collectionCode = !body.collectionCode.trim() ? undefined : body.collectionCode;
    searchMetaData.catalogNumber = !body.catalogNumber.trim() ? undefined : body.catalogNumber;
    searchMetaData.className = !body.className.trim() ? undefined : body.className;
    searchMetaData.order = !body.order.trim() ? undefined : body.order;
    searchMetaData.family = !body.family.trim() ? undefined : body.family;
    searchMetaData.genus = !body.genus.trim() ? undefined : body.genus;
    searchMetaData.specificEpithet = !body.specificEpithet.trim() ? undefined : body.specificEpithet;
    searchMetaData.infraspecificEpithet = !body.infraspecificEpithet.trim() ? undefined : body.infraspecificEpithet;
    searchMetaData.sex = !body.sex.trim() ? undefined : body.sex;
    searchMetaData.lifeStage = !body.lifeStage.trim() ? undefined : body.lifeStage;
    searchMetaData.country = body.country = !body.country.trim() ? undefined : body.country;
    searchMetaData.patch = body.patch = !body.patch.trim() ? undefined : body.patch;
   

    submissionModel.getByMetaDataFilter(searchMetaData)
        .then(submissionResponse => {

            var converted = []
            converted['submissionlist'] = submissionResponse['submissionlist']
            converted['metadatalist'] = []

            var allMetadataList = submissionResponse['metadatalist']
            var metadataOneReplicate = _.filter(allMetadataList, {replicate: '1'});
            var submissionIdList = converted['submissionlist'].map(x => x._id.toString())

            var metadataIncludesSubmission = metadataOneReplicate.filter(function (item) {
                return submissionIdList.includes(item.submissionId.toString());
            })

            
            metadataIncludesSubmission.forEach(element => {
                converted['metadatalist'].push(convertMetadataLowerToCamelCase(element))
            });

            var metadataIdListDownload = _.map(allMetadataList, "_id");

            res.render('search', {
                submissionList: converted['submissionlist'],
                metadataList: converted['metadatalist'],
                metadataIdList: metadataIdListDownload,
                listVisible: true,
                req:req,
                query: searchMetaData.searchKeyword
            })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.searchView = (req, res, next) => {

    res.render('search', {
        submissionList: undefined,
        listVisible: false,
        req: req,
        query:""
    })

}
exports.searchDetail = (req, res, next) => {
    metaDataModel.getMetaDataById(req.query.id)
        .then((metadata) => {
            exclusionList = ["flag", "_id", "valid", "submissionId"]
            res.render("search-detail", {
                metadata: metadata,
                req: req,
                exclusionList: exclusionList
            })
        })
}

exports.getUploadSuccess = (req, res, next) => {
    res.render("subsuccess", {req: req})
}

exports.downloadAll = (req, res, next) => {
    res.status(200).send("Success")
}
exports.downloadSelectedData = (req, res, next) => {

    var metaIdList = JSON.parse(req.body.metadataIdList);

     // with that meta data list, return raw files that matches metadata id
    rawFileModel.getListOfRawFileByMetaDataIdList(metaIdList)
        .then(rawfilelist => {
            metaDataModel.getMetaDataByIdList(metaIdList)
            .then(metadataList => {
                var preparingZipPromise = fileFuncs.prepareDownloadZipFile(metadataList, rawfilelist)
                preparingZipPromise.then(function (value) {
                    console.log(value)
                    res.download(value)
                })
            })

            
        })
}

function convertMetadataLowerToCamelCase(lower) {

    var resp = {}
    var added = false

    upper = new metaDataModel();
    Object.keys(lower).forEach(function (attrname) {
        added = false
        Object.keys(upper).forEach(function (metaattr) {
            if (metaattr.toLowerCase() == attrname) {
                resp[metaattr] = lower[attrname]
                added = true
            }
            else if(attrname == 'class'){
                // special case for class name
                resp['className'] = lower[attrname]
                added = true
            }
        })

        if (!added) {
            resp[attrname] = lower[attrname]
        }
    })

    return resp

}
