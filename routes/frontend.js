const express = require("express");
const router = express.Router();
const frontendControllers = require("../controllers/frontend");
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