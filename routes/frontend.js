const express = require("express");
const router = express.Router();
const path = require("path");
const researches = []
const path = require("path")
const multer = require("multer");
const frontendControllers = require("../controllers/frontend");


//  EBU MULTER
/*
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "data-files")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    console.log(file)
    if(file.fieldname === "metadataFile"){
        if (file.mimetype === 'text/csv' || path.extname(file.originalname) === ".csv" ){
            console.log("hello world cvs")
            cb(null, true)
        } else{
            cb(null, false)
        }
    } else {
<<<<<<< HEAD
        if (file.mimetype === 'application/zip' || path.extname(file.originalname) === ".zip"){
            console.log("hello world zip", path.extname(file.originalname))
=======
        if (file.mimetype === 'application/zip'){
            //console.log("hello world zip")
>>>>>>> 2adc0e95057513b9148d5cb49d0619eb66be5c75
            cb(null, true)
        } else{
            cb(null, false)
        }
    }
}
<<<<<<< HEAD
const upload = multer({ storage: fileStorage, fileFilter: fileFilter })
// router.post("/save-file", 
//     upload.fields([{name: "rawFile", maxCount: 1},
//                  {name: "metadataFile", maxCount:1}]),  frontendControllers.uploadResearch);
// router.get("/list-files", frontendControllers.getResearches);
=======
*/


// YALIN MULTER
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "data-files")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "metadataFile") {
        var ext = path.extname(file.originalname);
        if (ext == '.csv') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    } else {
        var ext = path.extname(file.originalname);
        if (ext == '.zip') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
})
//router.post("/save-file", upload.fields([{name: "rawFile", maxCount: 1}, {name: "metadataFile", maxCount:1}]), frontendControllers.uploadResearch);
//router.get("/list-files", frontendControllers.getResearches);
>>>>>>> 2adc0e95057513b9148d5cb49d0619eb66be5c75
// const frontendControllers = require("../controllers/frontend");
const submissionController = require("../controllers/submission");
const metaDataController = require("../controllers/metadata");

//router.post("/save-file", frontendControllers.uploadResearch);
//router.get("/list-files", frontendControllers.getResearches);
router.get("/", frontendControllers.getHomePage)
<<<<<<< HEAD
router.get("/upload-success", submissionController.getUploadSuccess)
router.post("/submission",  upload.fields([{name: "rawFile", maxCount: 1},
{name: "metadataFile", maxCount:1}]), submissionController.uploadSubmission);
router.get("/submission", submissionController.uploadSubmission);
=======
router.post("/save-file", upload.fields([{
    name: "rawFile",
    maxCount: 1
}, {
    name: "metadataFile",
    maxCount: 1
}]), submissionController.uploadSubmission);
//router.post("/save-file", submissionController.uploadSubmission);
>>>>>>> 2adc0e95057513b9148d5cb49d0619eb66be5c75
router.get("/list-files", submissionController.getListSubmission);
//router.get("/metadata-files", metaDataController.getListOfMetaDataFile);


module.exports = {
    routes: router
};