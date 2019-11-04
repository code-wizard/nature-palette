const rootDir = require("../util/path")
const path = require("path");
const Research = require("../models/research");
exports.getHomePage = (req, res, next) => {
    res.render("index", {
        title: "Nature Palette - Add Files",
        hasError: false,
        errorMessage: null
    });
}
exports.uploadResearch = (req, res, next) => {
    const body = req.body;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const description = body.description;
    const file = req.file
    console.log(file, "File")
    if (!file) {

        return res.status(422).render("index", {
            title: "Nature Palette - Add Files",
            hasError: true,
            errorMessage: "Attach only .csv or .zip file"
        });
    }
    research = new Research(firstName, lastName, description, file);
    research.save()
        .then(result => {
            console.log(result)
        })
        .catch(e => {
            console.log(e)
            throw e;
        })
    res.redirect("/list-files")
}
exports.getResearches = (req, res, next) => {

    Research.fetchAll()
        .then(researches => {
            console.log(researches, 'Here now')
            res.render('list', {
                title: "All Research Files",
                researches: researches
            })
        })
        .catch(err => {
            console.log(err)
        })

}