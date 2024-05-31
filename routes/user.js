const express=require("express");
const router=express.Router();
const user=require("../models/user.js");
const aysncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const { savedredirectUrl } = require("../utils/middleware.js");
const userController=require("../controllers/user.js");





//signup

router.route("/signup")
    .get(userController.getsignup)
    .post(aysncWrap(userController.postsignup));


//login

router.route("/login")
    .get(userController.getLogin)
    .post(savedredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.postLogin);


router.get("/logout",userController.logout);

module.exports=router;