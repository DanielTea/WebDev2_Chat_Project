var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {
        error: req.flash('error'),
        success: req.flash('success')
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
    res.redirect('/');
});

/*
 *  Temporary test routes for development
 */

router.get('/test-user', (req, res) => {
    var User = require('../models/user');
    User.findOne({
        email: 'test@example.com'
    }, (err, user) => {
        if (err) console.log(err);
        res.send(user);
    });
});

router.get('/test-login', (req, res) => {
    res.send(req.user);
});

router.get('/test-register', (req, res) => {
    var User = require('../models/user');

    var user = new User({
        firstName: req.params.firstName,
        email: req.params.email
    });
    user.password = user.generateHash(req.params.password);

    user.save(function(err) {
        if (err) {
            // Duplicate email
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send('duplicate user');
            }

            // Some other error
            return res.status(400).send(err);
        }

        res.send('user registered')
    });
});

module.exports = router;
