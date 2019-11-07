const express = require("express");
const router = express.Router();
const researches = []
const multer = require("multer");
const frontendControllers = require("../controllers/frontend")
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
        if (file.mimetype === 'text/csv'){
            console.log("hello world cvs")
            cb(null, true)
        } else{
            cb(null, false)
        }
    } else {
        if (file.mimetype === 'application/zip'){
            console.log("hello world zip")
            cb(null, true)
        } else{
            cb(null, false)
        }
    }
    
    
}
const upload = multer({ storage: fileStorage, fileFilter: fileFilter })
router.post("/save-file", 
    upload.fields([{name: "rawFile", maxCount: 1},
                 {name: "metadataFile", maxCount:1}]),  frontendControllers.uploadResearch);
router.get("/list-files", frontendControllers.getResearches);
// const frontendControllers = require("../controllers/frontend");
const submissionController = require("../controllers/submission");
const metaDataController = require("../controllers/metadata");

//router.post("/save-file", frontendControllers.uploadResearch);
//router.get("/list-files", frontendControllers.getResearches);
router.get("/", frontendControllers.getHomePage)
router.post("/save-file", submissionController.uploadSubmission);
router.get("/list-files", submissionController.getListSubmission);
//router.get("/metadata-files", metaDataController.getListOfMetaDataFile);


module.exports = {
    routes: router
};