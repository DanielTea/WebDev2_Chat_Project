const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Tag = require('../models/tag');
const userAuth = require('../userAuth');

/**
 * EJS route - INDEX
 * Renders an index page of all users saved in the database
 */
router.get('/', userAuth.isAuthenticated, function (req, res) {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('users/index', {
            users: users
        });
    });
});

/**
 * EJS route - EDIT
 * Shows the form to update the user
 */
router.get('/:id/update', userAuth.isActiveUser, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('users/update', {
            user: user
        });
    });
});

/**
 * EJS route - CREATE
 * Shows the form to create a new user
 */
router.get('/create', userAuth.isGuest, function (req, res) {
    res.render('users/create');
});

/**
 * EJS route - STORE
 * Insert the new user into the database
 */
router.post('/', userAuth.isGuest, function (req, res) {
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

    user.save(function (err) {
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

/**
 * Helper function to insert data into a data object _if_ the value is not empty
 * @param data Data object to insert the value into
 * @param data_name Column name in the array
 * @param value Value to insert
 * @param do_hash Whether the value should be hashed with bcrypt (for passwords)
 */
function setObjectValue(data, data_name, value, do_hash = false) {
    if (value && value.length > 0) {
        data[data_name] = do_hash ? User.generateHash(value) : value;
    }
}

/**
 * EJS route - UPDATE
 * Updates the corresponding user with data from the request body
 */
router.patch('/:id', userAuth.isActiveUser, function (req, res) {
    var id = req.params.id;
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
            return res.status(500).send('Database error');
        }
        return res.redirect('/users/' + id);
    });
});

/**
 * EJS route - SHOW
 * Shows a detailed page for the corresponding user
 */
router.get('/:id', userAuth.isAuthenticated, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('users/show.ejs', {
            user: user
        });
    });
});

/**
 * EJS route - DESTROY
 * Deletes the corresponding user from the database
 */
router.delete('/:id', userAuth.isAuthenticated, function (req, res) {
    User.findOneAndRemove({
        _id: req.params.id
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        return res.redirect('/login');
    });
});

/*
 * User's Tags below this line
 */

/**
 * EJS route - INDEX
 * Shows all tags the user subscribes to
 */
router.get('/:id/tags', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        var userTags = user.tags;
        var mongodTagIds = [];
        if (userTags.length < 1) {
            res.render('users/tags/index', {
                tags: []
            });
        } else {
            for (var i = 0; i < userTags.length; i++) {
                var tagID = new objectId(userTags[i]);
                mongodTagIds.push(tagID)
            }
            Tag.find({
                _id: {
                    $in: mongodTagIds
                }
            }, (err, tags) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Database error');
                }
                res.render('users/tags/index', {
                    tags: tags
                });
            });
        }
    });
});

/**
 * AJAX route - CREATE
 * Insert an existing tag into the personal collection of the user
 */
router.post('/:id/tags', userAuth.isActiveUser, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var tagId = new objectId(req.body.tag);

    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        user.tags.push(tagId);
        User.update({
            _id: req.params.id
        }, {
            $set: {
                tags: user.tags
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            return res.send();
        });
    });
});

/**
 * AJAX route - DESTROY
 * Remove an existing tag out of the user's personal collection
 */
router.delete('/:id/tags/:tagId', userAuth.isActiveUser, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var tagId = new objectId(req.params.tagId);

    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        var newTags = user.tags.filter(item => !item.equals(tagId));
        User.update({
            _id: req.params.id
        }, {
            $set: {
                tags: newTags
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            return res.send();
        });
    });
});

module.exports = router;
