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
const agenda = require("./util/agenda").agenda
// const emails = require("./util/emails")



process.env.NODE_ENV = 'production';
const config = require('./config.js');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("file"))
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoute);
app.use(fontendData.routes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(global.gConfig.node_port)
    agenda.on( "ready", function() {
        agenda.start()
        console.log("Agenda Connected")
        
      })
    
})


