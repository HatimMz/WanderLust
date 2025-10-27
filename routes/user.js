const express = require("express")
const router = express.Router()
const user = require("../models/user/user.js")
const passport = require("passport")
const customError = require("../utils/customError.js")
const {saveRedirectUrl} = require("../utils/middlewares.js")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", async (req, res) => {
    try {
        const { username, password, email } = req.body
        const userObj = {
            username: username,
            email: email
        }

        const newUser = new user(userObj)
        const registeredUser = await user.register(newUser, password)
        console.log(registeredUser)


        req.login(registeredUser, (err)=>{
            if (err){
                return next(err)
            }
            req.flash("success", "User Registered successfully")
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error2", err.message)
        res.redirect("/users/signup")
    }

})


router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})


router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/users/login", failureFlash: true }), async (req, res) => {
    try {
        req.flash("success", "Welcome back!")
        const redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)
    } catch (err) {
        console.log(err.message)
    }

})

router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(new customError(500 ,err.message))
        }
        req.flash("success", "successfully LoggedOut")
        res.redirect("/users/login")
    })
})


module.exports = router