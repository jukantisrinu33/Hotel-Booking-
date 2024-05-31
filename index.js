const express=require("express");
const mongoose=require("mongoose");
const path=require("path")
const app=express();
const ejs=require("ejs");
const methodOverride=require("method-override");
const Listing=require("./models/listing.js");
// const review=require("./models/review.js");
const ejsMate=require("ejs-mate");
// const aysncWrap=require("./utils/asyncWrap.js");                     //these all files are shifted and used only to routes
const ExpressError=require("./utils/ExpressError.js");
const MongoStore = require('connect-mongo');
// const {listingSchema}=require("./schema.js");
// const {reviewSchema}=require("./schema.js");
const listingRouter=require("./routes/Listing.js");
const ReviewRouter=require("./routes/Review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const multer  = require('multer');
const { error } = require("console");
const upload = multer({ dest: 'uploads/' })


app.set("view Engine",ejs);
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

//connect-mongo
const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("eooer in mongoose store ",error);
})


const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}





app.use(session(sessionOptions));
//using flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//creating a flash middelware
app.use((req,res,next)=>
{
    res.locals.Listingadded=req.flash("success");
    res.locals.undefinedListing=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.listen(3000,()=>
{
    console.log("app is listening");
})


const dbURL=process.env.ATLASDB_URL;
const localDBURL='mongodb://127.0.0.1:27017/wanderlust';

async function main()
{
    await mongoose.connect(dbURL);

}

main()
.then((res)=>
{
    console.log("connected");
})
.catch((err)=>
{
    console.log(err);
});

//main route

//listings path
app.use("/listings",listingRouter);

//reviewpath
app.use("/listings/:id/reviews",ReviewRouter);

app.post("/listings/search",async(req,res,next)=>
{
    let titlename=req.body.title;
    // console.log(titlename);
    const alllistings = await Listing.find({title:titlename});
    res.render("Listing/index.ejs",{alllistings}); 
    
})

//users path
app.use("/",userRouter);




app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"pageNot Found!"))
});

app.use((err,req,res,next)=>
{
    const {statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("Listing/error.ejs",{err});
})


//Error Hnadling
// app.use((err,req,res,next)=>
// {
//     res.send("something Went Wrong");
// })






 

