const user=require("../models/user.js");

//get signup
module.exports.getsignup=(req,res,next)=>{
    res.render("./users/signup.ejs")
};

//post signup
module.exports.postsignup=async(req,res,next)=>
{
    try{
    const {username,email,password}=req.body;
    let usersignup=new user({email:email,username:username});
    const registereduser=await user.register(usersignup,password);
    console.log(registereduser);
    req.login(registereduser, (err)=>
    {
        if(err)
        {
            return next(err);
        }
        else
        {
            req.flash("success","Logged in Successfully!");
            res.redirect("/listings");
        }
    })
    }
    catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");

    }
    
};

//get login
module.exports.getLogin=(req,res)=>
{
    res.render("./users/login.ejs");
};

//post Login
module.exports.postLogin=async(req,res,next)=>
{
    console.log(res.locals.redirectUrl);
    req.flash("success","welcome back to wanderlust!");
    res.redirect(res.locals.redirectUrl);   
};

//logout
module.exports.logout=(req,res,next)=>
{
    req.logout((err)=>
    {
        if(err)
        {
            return next(err);
        }
        else
        {
            req.flash("success","Logged out Successfully!");
            res.redirect("/listings");
        }
    })
};