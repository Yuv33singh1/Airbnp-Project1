if(process.env.NODE_ENV  != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const userRouter = require("./routes/user.js");
// const listing = require("./routes/listing.js")



const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongose.connect(dbUrl);
}

main().then(() =>{
    console.log("connected to Db");
}).catch((err) =>{
    console.log(err);
});
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:  24 *3600,
});

store.on("error", () =>{
    console.log("ERROR IN MOMNGO SESSION STORE" ,err);
})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
       },
};



app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
     next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not Found!! "));
});

app.use((err, req, res, next) =>{
    let{statusCode = 500, message= "something went wrong"} = err;
    console.log(err)
    res.status(statusCode).render("error.ejs",{message});
        //res.status(statusCode).send(message);
});


app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});