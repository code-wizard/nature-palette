// const csv = require('csv-parser');
// const fs = require('fs');
const submissionModel = require("../models/submission");
// const metaDataController = require("../controllers/metadata");
const fileFuncs = require("../util/file_functions")
const path = require("path");
const Research = require("../models/research");
const multer = require("multer")
const dateFn = require("date-fns")
const _ = require("lodash");
const processRawFiles = require("../util/agenda")

module.exports.uploadSubmission = (req, res) => {

    if(req.method === "POST"){
        const body = req.body;

        submission = new submissionModel();
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
        console.log(metadataFile)
        if (!metadataFile || !rawFile) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Attach only .csv or .zip file"
            });
        } 
        else if (parseInt(submission.embargo) && !submission.releaseDate) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Please specify embargo expiry date"
            });
        }
        else if(submission.releaseDate && dateFn.getYear(new Date(submission.releaseDate)) < dateFn.getYear(new Date())){
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Embargo release date must be in the future."
            });
        }
        
        else if(submission.releaseDate && dateFn.differenceInYears(new Date(), new Date(submission.releaseDate))>1) {
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Embargo release date must not be greater then 1 year from today."
            });
        }
        else if(submission.published === "yes" && !submission.doi){
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Digital Object Reference is required for a published research."
            });
        }
        else if(submission.published === "yes" && !submission.reference){
            return res.status(422).render("submission", {
                title: "Nature Palette - Upload",
                hasError: true,
                success: false,
                errorMessage: "Reference is required for a published research."
            });
        }
        
        // create a stream to read the csv
        const stream = fileFuncs.readRows(metadataFile[0].path, {
            mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
          } )
          // Get the required field
        if(body.dataFrom === "field")
          requireField = fileFuncs.fieldData()
        else
          requireField = fileFuncs.museumData()
        
        // Make metadata lower case
        for (f of requireField){
            rm.push(f.toLocaleLowerCase())
        }
        let index = 0;
        stream.on('headers', (headers) => {
          
            const intersection = _.intersection(rm, headers)
            console.log(intersection, "Intersection", rm, headers)
            
            if (intersection.length != requireField.length){
                missingRFields = _.difference(rm, intersection)
                console.log(missingRFields)
                     return res.status(422).render("submission", {
                            title: "Nature Palette - Upload",
                            hasError: true,
                            success: false,
                            errorMessage: `Your metadata is missing some required fileds ${missingRFields}`
                        });
            }
            else {
             submission.save()
             .then( (id)=> {
                 console.log(id, "Hello world")
                 processRawFiles.readRawFiles(metadataFile[0].path,rawFile[0].path, id, rm, res)
                // res.redirect("/upload-success")
             })
             .catch((err)=>{
                console.log("unable to save submission",err)
             })
                // res.redirect("/upload-success")
            }
            stream.destroy()
            
          })
        .on('data', (row) => {
            // processRawFiles.readRawFiles("data-files/" + metadataFile[0].filename,
            //  "data-files/" + rawFile[0].filename, rm)
            
            stream.destroy()
            // console.log(index++, "fdfd", row)
            // data.push(row);
            // console.log(row)
        })
        .on("end", () => {
            // console.log(data, "Done")
            // console.log("ds")
            // fileFuncs.unzipFile("fdfd")
        })

        // var insertedSubmissionId;
        // var savePromise = new Promise((resolve, reject) => {
        //     resolve(submission.save());
        // });
        // savePromise.then(function(value){
        //     insertedSubmissionId = value;
            
        //     // reading metadata file
        //     var filePath = submission.metaDataFile.path;
        //     new Promise((resolve, reject) => {
        //         var results = [];
        //         fs.createReadStream(filePath)
        //             .pipe(csv())
        //             .on('data', (data) => results.push(data))
        //             .on('end', () => {
        //                 resolve(results);
        //             });
        //     }).then(function (value) {
                
        //         // after read, insert meta data file list
        //         var contentOfMetaDataFile = value;
        //         contentOfMetaDataFile.forEach(element => {
        //             element.submissionId = insertedSubmissionId;
        //         });
        //         metaDataController.uploadMetaData(contentOfMetaDataFile);
        //     })
        // });
        // }
    } else {
        res.render('submission', {
            title: "Submit Research",
            hasError: false,
            success: false,
        })
    }
    // kaydet
    
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

exports.getUploadSuccess = (req, res, next) => {
    res.render("subsuccess")
}