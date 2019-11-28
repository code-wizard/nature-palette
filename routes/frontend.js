const express = require("express");
const router = express.Router();
// const path = require("path");
const tmp = require('tmp');
const researches = []
const path = require("path")
const auth = require("../middleware/auth");
const multer = require("multer");
const frontendControllers = require("../controllers/frontend");


//  EBU MULTER

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // create tmp directory 
        tmpobj = tmp.dirSync();
        // console.log('Dir: ', tmpobj.name);
        cb(null, tmpobj.name)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    // console.log(file)
    if (file.fieldname === "metadataFile") {
        if (file.mimetype === 'text/csv' || path.extname(file.originalname) === ".csv") {
            cb(null, true)
        } else {
            cb(null, false)
        }
    } else {
        if (file.mimetype === 'application/zip' || path.extname(file.originalname) === ".zip") {
            //console.log("hello world zip")
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
}



// YALIN MULTER
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {

//         cb(null, "data-files")
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// });
// const fileFilter = (req, file, cb) => {
//     if (file.fieldname === "metadataFile") {
//         var ext = path.extname(file.originalname);
//         if (ext == '.csv') {
//             cb(null, true)
//         } else {
//             cb(null, false)
//         }
//     } else {
//         var ext = path.extname(file.originalname);
//         if (ext == '.zip') {
//             cb(null, true)
//         } else {
//             cb(null, false)
//         }
//     }
// }

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
})
//router.post("/save-file", upload.fields([{name: "rawFile", maxCount: 1}, {name: "metadataFile", maxCount:1}]), frontendControllers.uploadResearch);
//router.get("/list-files", frontendControllers.getResearches);
// const frontendControllers = require("../controllers/frontend");
const submissionController = require("../controllers/submission");
const metaDataController = require("../controllers/metadata");

//router.post("/save-file", frontendControllers.uploadResearch);
//router.get("/list-files", frontendControllers.getResearches);
router.get("/", frontendControllers.getHomePage)
router.get("/upload-success", isLoggedIn, submissionController.getUploadSuccess)
router.post("/submission", isLoggedIn, upload.fields([{
        name: "rawFile",
        maxCount: 1
    },
    {
        name: "metadataFile",
        maxCount: 1
    }
]), submissionController.uploadSubmission);
router.get("/submission", isLoggedIn, submissionController.uploadSubmission);
router.get("/list-files", submissionController.getListSubmission);
router.get("/search", submissionController.searchView);
router.post("/search",  submissionController.getListSubmission);
router.post("/download", submissionController.downloadSelectedData);
//router.post("/download-all", submissionController.downloadAll);
router.get("/search-detail", submissionController.searchDetail);

// router.get("/forgot-password", frontendControllers.getForgotPassword);

module.exports = {
    routes: router
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).send("<h3> Access Denied. Please <a href='/auth/login'>login</a> to access this page</h3>");
  }
