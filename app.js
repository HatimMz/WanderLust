const express = require("express");
const app = express();
const path = require("path");
const methodOverrride = require("method-override");
const engine = require('ejs-mate');
const PORT = 3000;
const customError = require("./utils/customError.js")
const session = require('express-session')
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const user = require("./models/user/user.js")



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrride("_method"));
app.engine("ejs", engine);


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}
main();

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 7*24*3600*1000 }   
}

app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//flash msg middleware
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.error2 = req.flash("error2");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new user({
//         email: "delta@gmail.com",
//         username: "deltaStudent"
//     });

//     let registeredUser = await user.register(fakeUser, "delta123");
//     res.send(registeredUser)
// })

// home route
app.get("/", (req, res) => {
    res.send("This is root node");
});

//user router
app.use("/users", userRouter);


//listing router 
app.use("/listings", listingRouter);


// review router
app.use("/listings/:id/reviews", reviewRouter);


// page not found middleware
app.use((req, res, next) => {
    next(new customError(404, "Page not found"));
});


// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});







app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});