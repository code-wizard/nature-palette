const rootDir = require("../util/path")
const path = require("path");

exports.get404 = (req, res, next) => {
    res.status(404).render("404", {title: "Page Not Found"});
    // res.status(404).sendFile(path.join(rootDir, 'views','frontend', '404.html'));

}