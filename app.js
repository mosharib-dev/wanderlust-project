if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/Public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,  
});


store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionConfig = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        maxAge : 1000*60*60*24*7
    },
};


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    const successFlash = req.flash("success");
    const errorFlash = req.flash("error");
    res.locals.success = Array.isArray(successFlash) ? successFlash : [];
    res.locals.error = Array.isArray(errorFlash) ? errorFlash : [];
    res.locals.currentUser = req.user || null;  // ✅ ensure always set
    next();
});

// For all listing routes
app.use("/listing",listingRouter); 

// For all review routes
app.use("/listing/:id/reviews",reviewRouter);

// For all user routes
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("listing/error",{err});
});

app.listen(8080,() => {
    console.log("Server is listening on port: 8080");
});