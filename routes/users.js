var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');
var Tag = require('../models/tag');
const bcrypt = require('bcryptjs');
const userAuth = require('../userAuth');


router.get('/', userAuth.isAuthenticated, function(req, res) {
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

router.get('/:id/update', userAuth.isActiveUser, function(req, res) {
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

router.get('/create', userAuth.isGuest, function(req, res) {
    res.render('users/create');
});

router.post('/', userAuth.isGuest, function(req, res) {
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

function setObjectValue(data, data_name, value, do_hash = false) {
    if (value && value.length > 0) {
        data[data_name] = do_hash ? User.generateHash(value) : value;
        return;
    }
}

router.patch('/:id', userAuth.isActiveUser, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    var data = {};
    setObjectValue(data, 'firstName', req.body.firstName);
    setObjectValue(data, 'lastName', req.body.lastName);
    setObjectValue(data, 'birthDate', req.body.birthDate);
    setObjectValue(data, 'email', req.body.email);
    setObjectValue(data, 'status', req.body.status);
    setObjectValue(data, 'pictureUrl', req.body.pictureUrl);
    setObjectValue(data, 'password', req.body.password, true);

    User.update({
        _id: id
    }, {
        $set: data
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).render('error', {
                error: err
            });
        }
        return res.redirect('/users/' + id);
    });
});

router.get('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    User.findById(id, function(err, user) {
        res.render('users/show.ejs', {
            user: user
        });
    });

});

router.delete('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    User.findOneAndRemove({
        _id:id
    }, (err) => {
            if (err) {
            console.log(err);
            return res.status(500).render('error', {
                error: err
            });
        }
        return res.redirect('/login');
    });

});

/*
 * User's Tags
 */

router.get('/:id/tags', userAuth.isAuthenticated,  function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    try {
        User.findById(id, (err, user) => {
            if (err) console.log(err);

            console.log(user.tags);

            var userTags = user.tags;
            var mongodTagIds = [];

            if(userTags.length <1){

                console.log("render emopty")

                res.render('users/tags/index', {
                    tags: []
                });

            }
            else{

                console.log("tags found")

                for (var i = 0; i < userTags.length; i++){

                    var tagID = new objectId(userTags[i]);
                    mongodTagIds.push(tagID)

                }

                console.log("tagsidlist " + mongodTagIds);

                try {

                    Tag.find({ _id : { $in : mongodTagIds} } , (err, tags) => {

                        console.log("tags"+ tags);

                        if (err) console.log(err);

                        res.render('users/tags/index', {
                            tags: tags
                        });

                    });
                } catch (err) {
                    throw err;
                }

            }


        });
    } catch (err) {
        throw err;
    }

});

router.post('/:id/tags', userAuth.isActiveUser, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    var tagId = new objectId(req.body.tag);

    User.findById(id, function(err, user) {
        user.tags.push(tagId);
        User.update({
            _id: id
        }, {
            $set: { tags: user.tags }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.send();
        });
    });
});

router.delete('/:id/tags/:tagId', userAuth.isActiveUser, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    var tagId = new objectId(req.params.tagId);

    User.findById(id, function(err, user) {
        var newTags = user.tags.filter(item => !item.equals(tagId));
        User.update({
            _id: id
        }, {
            $set: { tags: newTags }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.send();
        });
    });
});


module.exports = router;
