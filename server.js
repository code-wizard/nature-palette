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
const authRoute = require("./routes/auth");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const agenda = require("./util/agenda").agenda
const config = require('./config.json');
const passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
// const emails = require("./util/emails")


require('./passport')(passport); // pass passport for configuration

process.env.NODE_ENV = 'production';
const config = require('./config.js');
process.env.NODE_ENV = 'development';
// const config = require('./config.js');

if (!config.myprivatekey) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
app.use(session({
  secret: config.myprivatekey, // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("file"))
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoute);
app.use(express.json());
app.use("/auth", authRoute)
app.use(fontendData.routes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(global.gConfig.node_port)
    agenda.on( "ready", function() {
        agenda.start()
        console.log("Agenda Connected")
        
      })
    
})


