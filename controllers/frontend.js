const rootDir = require("../util/path")
const fileFuncs = require("../util/file_functions")
const path = require("path");
const Research = require("../models/research");
const multer = require("multer")
const _ = require("lodash");
const processRawFiles = require("../util/agenda")

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
    const submissionType = body.type;
    const embargo = body.embargo;
    const releaseDate = body.embargoDate;
    const metadataFile = req.files["metadataFile"][0];
    const rawFile = req.files["rawFile"][0];

    
    
    // if (!metadataFile || !rawFile) {

    //     return res.status(422).render("index", {
    //         title: "Nature Palette - Add Files",
    //         hasError: true,
    //         errorMessage: "Attach only .csv or .zip file"
    //     });
    // }
    // else if (embargo && !releaseDate) {
    //     return res.status(422).render("index", {
    //         title: "Nature Palette - Add Files",
    //         hasError: true,
    //         errorMessage: "Please specify embargo expiry date"
    //     });
    // }
    
    
    // const stream = fileFuncs.readRows("data-files/" + metadataFile.filename )
    const stream = fileFuncs.readRows("data-files/", {
        mapHeaders: ({ header, index }) => _.replace(header.toLowerCase(), " ", "")
      } )
    requireField = ['fileName', 'institutionCode', 'catalogNumber', 'genus', 'specificEpithet', 'Patch', 'LightAngle1', 'LightAngle2', 
    'ProbeAngle1', 'ProbeAngle2', 'Replicate'];
    const rm = []
    const hm = []
    data = []
    // Make metadata lower case
    for (f of requireField){
        rm.push(f.toLocaleLowerCase())
    }
    let index = 0;
    stream.on('headers', (headers) => {
        // console.log(`First header: ${headers}`)
        // Make all header lower case
        // for (h of headers){
        //     hm.push(_.replace(h.toLocaleLowerCase(), " ", ""))
        // }
        // console.log(hm)
        const intersection = _.intersection(rm, hm)
        
        if (intersection.length != requireField.length){
            const missingRFields = _.difference(rm, intersection)
            // console.log(missingRFields)
                 return res.status(422).render("index", {
                        title: "Nature Palette - Add Files",
                        hasError: true,
                        errorMessage: `Your metadata is missing some required fileds ${missingRFields}`
                    });
        }
        
        stream.destroy()
        
      })
    .on('data', (row) => {
        processRawFiles.readRawFiles("", rm)
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
    //-------separate old from new
    
    // Get metadata file first line  columns
    // Get the darwin base on the type of submission
    // else if () {

    // }
    // research = new Research(firstName, lastName, description, metadataFile, rawFile, embargo, releaseDate);
    // research.save()
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(e => {
    //         console.log(e)
    //         throw e;
    //     })
    // res.redirect("/list-files")
}

exports.getResearches = (req, res, next) => {
    
    Research.getDarwin("museum")
    .then(result => {
        // console.log(result.length)
        // for (let d of result){
        //     console.log(d)
        // }
        //console.log(result, "success")
    })
    .catch(err => {
        console.log(err, "error")
    })
    Research.fetchAll()
        .then(researches => {
            // console.log(researches, 'Here now')
            res.render('list', {
                title: "All Research Files",
                researches: researches
            })
        })
        .catch(err => {
            console.log(err)
        })

}