var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
const userAuth = require('../userAuth');

router.get('/login', (req, res) => {
    User.findOne({}, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        res.render('login', {
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
    res.redirect('/');
});

module.exports = router;
