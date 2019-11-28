const { User, validate } = require("../models/user");


exports.getLogin = async (req, res, next)=>{
    res.render("login", {
        req: req,
        title: "Nature Palette - Login"
    })
}


exports.getRegister =  (req, res) => {
    
    return res.render("register", {
        req: req,
        title: "Nature Palette - Join",
        errorMsg: "",
        body: {}
    });
    
}
exports.getLogout = (req, res)=>{
    req.logout();
    res.redirect("/");
}


exports.registrationValidation = async (req, res, next) => {
    // validate the request body first
    let errorMsg;
    // if (req.method === "POST") {
        const { error } = validate(req.body);
        if (error) {
            res.status(400);
            errorMsg = error.details[0].message
            return res.render("register", {
                title: "Nature Palette - Join",
                errorMsg: errorMsg,
                req: req,
                body: req.body
            })
        } 
        //find an existing user
        let user =  await User.findOne({ email: req.body.email });
        if (user){
            res.status(400);
            errorMsg="User already registered."
            return res.render("register", {
                title: "Nature Palette - Join",
                errorMsg: errorMsg,
                req: req,
                body: req.body
            })
        } 
    next()
    
    // } 
}