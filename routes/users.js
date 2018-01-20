var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');


router.get('/', function(req, res) {
    try {
        User.find({}, (err, users) => {
            if (err) console.log(err);
            res.render('users/index', {
                users: users
            });
        });
    } catch (err) {
        throw err;
    }
});

router.get('/:id/update', function(req, res) {
    try {
        var objectId = require('mongodb').ObjectId;
        var id = new objectId(req.params.id);

        User.findById(id, function(err, user) {
            res.render('users/update', {
                user: user
            });
        });

    } catch (err) {
        throw err;
    }
});

router.get('/create', function(req, res) {
    res.render('users/create');
});

router.post('/', function(req, res) {
    if (req.user) {
        req.flash('error', 'You are already signed up, you cannot register again.');
        return res.status(400).redirect('/users/create');
    }
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: User.generateHash(req.body.password),
        birthDate: new Date(req.body.birthDate),
        email: req.body.email,
        status: req.body.status
    });
    user.save(function(err) {
        if (err) {
            console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
                req.flash('error', 'This email is already taken.');
                return res.status(400).redirect('/users/create');
            }

            req.flash('error', 'An error occured. Please try again.');
            return res.status(400).redirect('/users/create');
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Yeah! You are registered now.');
            return res.redirect('/users/' + req.user._id);
        });
    });
});

router.patch('/:id', function(req, res) {

    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    var data = req.body;

    if (req.body.password != "") {
        // data.password = User.generateHash(data.password);
        console.log(data)
    } else {
        delete data.password
        console.log(data)
    }

    User.update({
            _id: req.params.id
        }, {
            $set: data
        }, function(err) {
            if (err) {
                throw err;
            } else {
                console.log("update successful")
            }
        }

    );



    User.findById(id, function(err, user) {
        res.render('users/show.ejs', {
            user: user
        });
    });


});


router.get('/:id', function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    User.findById(id, function(err, user) {
        res.render('users/show.ejs', {
            user: user
        });
    });

});

module.exports = router;
