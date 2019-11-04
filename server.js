// const http = require("http");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views") // where to find templates
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fontendData = require("./routes/frontend");
const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "data-files")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/zip') {
        cb(null, true)
    }
    cb(null, false)
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("file"))
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoute);
app.use(fontendData.routes);

app.use(errorController.get404);
mongoConnect(() => {
    app.listen(3334)
})


