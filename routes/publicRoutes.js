/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the routes/endpoints for the client interaction
with the public side.
*/

const express = require("express");
const router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../databaseModels/userModel").User;
const Post = require("../databaseModels/postModel").Post;

router.all("/*", (req, res, next) => {

    req.app.locals.layout = "public";

    next();
});

// public index endpoint
router.get("/", (req, res) => {
    res.render("public/index");
});

//public info page endpoint
router.get("/info", async (req, res) => {
    const posts = await Post.find();
    res.render('public/info', {posts: posts});
});

// Local
passport.use(new localStrategy({
    usernameField: "email",
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) {
            return done(null, false, req.flash("InputEmail", req.body.InputEmail), req.flash("error-message", "The email or password is incorrect"));
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (!passwordMatched) {
                return done(null, false, req.flash("InputPassword", req.body.InputPassword), req.flash("error-message", "The email or password is incorrect"));
            }

            return done(null, user);
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// loginGet endpoint
router.get("/login", (req, res) => {
    res.render('public/login', {
        message: req.flash('error')
    });
});

router.post("/login", function(req, res, next) {
    passport.authenticate("local", function (err, user) {
        if(!user) {
        return res.redirect('/login');
        }

        req.logIn(user, function() {
            if(user.role === "editor") {
               	return res.redirect('/editor/');
            } else if(user.role === "dispatcher") {
                return res.redirect("/dispatcher/")
            }
        });
    }) (req, res, next);
});

router.get("/post/:id", (req, res) => {
    const id = req.params.id;

    // A status message 404 is given if the post cannot be found. Else it renders the singlePost.handlebars file.
    Post.findById(id)
        .populate({path: "user", model: "user"})
        .then(post => {
            if (!post) {
                res.status(404).json({message: "No Post was found"});
            } else {
                res.render("public/singlePost", {post: post});
            }
        });
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

// module is imported to app.js
module.exports = router;
