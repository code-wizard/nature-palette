const express = require("express");
const router = express.Router();
const researches = []
const frontendControllers = require("../controllers/frontend")

router.post("/save-file", frontendControllers.uploadResearch);
router.get("/list-files", frontendControllers.getResearches);
router.get("/", frontendControllers.getHomePage)

module.exports  = {
    routes: router,
    data: researches
};