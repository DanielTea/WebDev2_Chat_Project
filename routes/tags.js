const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const userAuth = require('../userAuth');
const User = require('../models/user');

/**
 * EJS route - INDEX
 * Renders an index page for all tags saved in the database
 */
router.get('/', userAuth.isAuthenticated, function (req, res) {
    Tag.find({}, (err, tags) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('tags/index', {
            tags: tags
        });
    });
});

/**
 * EJS route - CREATE
 * Shows the form to create a new tag
 */
router.get('/create', userAuth.isAuthenticated, function (req, res) {
    res.render('tags/create');
});

/**
 * EJS route - SHOW
 * Shows the detail page of a tag, which contains of a chat-like exchange of messages about the tag
 */
router.get('/:id', userAuth.isAuthenticated, function (req, res) {
    Tag.findById(req.params.id)
        .populate({
            path: 'messages',
            populate: {
                path: 'user'
            }
        })
        .exec((err, tag) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            res.render('tags/show', {
                tag: tag
            });
        });
});

/**
 * EJS route - EDIT
 * Shows the form to update the tag
 */
router.get('/:id/update', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    Tag.findById(id, function (err, tag) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('tags/update', {
            tag: tag
        });
    });

});

/**
 * EJS route - STORE
 * Insert a new tag into the database
 */
router.post('/', userAuth.isAuthenticated, function (req, res) {
    var userId = req.user._id;
    var tag = new Tag({
        name: req.body.name,
        description: req.body.description,
        patternClass: req.body.patternClass,
        createdBy: req.user
    });

    tag.save(function (err) {
        if (err) {
            console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
                req.flash('error', 'This tag already exists.');
                return res.status(400).redirect('/tags/create');
            }
            req.flash('error', 'An error occured. Please try again.');
            return res.status(400).redirect('/tags/create');
        }

        req.user.tags.push(tag._id);
        User.update({
            _id: userId
        }, {
            $set: {
                tags: req.user.tags
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            req.flash('success', 'Yeah! Your new tag was created.');
            return res.redirect('/users/' + userId + '/tags');
        });
    });
});

/**
 * EJS route - DESTROY
 * Deletes the tag out of the database
 */
router.delete('/:id', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    Tag.findOneAndRemove({
        _id: id
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        req.flash('success', 'Your tag was deleted.');
        return res.redirect('/users/' + req.user._id + '/tags');
    });
});

/**
 * EJS route - UPDATE
 * Updates the tag's data with the one's provided in the request body
 */
router.patch('/:id', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    var data = req.body;

    Tag.update({
        _id: id
    }, {
        $set: data
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        req.flash('success', 'Your tag was updated.');
        return res.redirect('/users/' + req.user._id + '/tags');
    });
});

module.exports = router;
