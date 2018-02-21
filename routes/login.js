const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

/**
 * EJS route
 * Shows the login form
 */
router.get('/login', (req, res) => {
    User.findOne({}, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).send('Database error');
        }
        res.render('login', {
            title: process.env.SITE_TITLE,
            developmentUser: user,
            developmentPassword: process.env.DEV_USER_PASSWORD
        });
    });
});

/**
 * EJS route
 * Performs the login using [Passport.JS](http://www.passportjs.org/)
 */
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

/**
 * EJS route
 * Performs a logout and redirects to the login page
 */
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You successfully logged out.');
    res.redirect('/login');
});

module.exports = router;
