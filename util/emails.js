const nodemailer = require("nodemailer");
const config = require('../config.json');

const sendEmail = (to, message) => {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.sender,
          pass: config.email.password
        }
      });
      
      var mailOptions = {
        from: config.email.from,
        to: to,
        subject: 'Research Upload',
        html: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
const prepareErrorMessageHTML = (errors, submission) =>{
    let errorMesg = ''
    for(error of errors) {
        errorMesg += "<p> "+ error.message +"</p>"
    }
    message =  "<div>Hello "+submission.firstName +"</div><div> Your research files have some errors. See error message below</div>"+
                errorMesg;
    return message
}
const successMesg = (submission) => {
    return "<div>Hello "+submission.firstName +"</div><div> Your file has been uploaded successfully without any errors </div>";
}


module.exports = {
    sendEmail: sendEmail,
    successMesg: successMesg,
    prepareErrorMessageHTML: prepareErrorMessageHTML
}