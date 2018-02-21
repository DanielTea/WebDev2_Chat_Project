const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');
const userAuth = require('../userAuth');

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

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You successfully logged out.');
    res.redirect('/login');
});

module.exports = router;
