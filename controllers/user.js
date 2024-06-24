const user = require("../models/user");

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) =>{
    try{
        let {username, email, password} = req.body;
        const newUser = new user ({email, username});
        const registerUser = await user.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
};

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) =>{
    req.flash("success", "Welcome! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
        
};
module.exports.logOut = (req , res, next) =>{
    req.logout((err)  =>{
       if(err) {
            return next(err);
       }
       req.flash("success", "you are logged out!");
       res.redirect("/listings");
    })
};
