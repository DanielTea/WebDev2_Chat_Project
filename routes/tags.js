var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Tag = require('../models/tag');
const userAuth = require('../userAuth');
var User = require('../models/user');
var Message = require('../models/message');

router.get('/', userAuth.isAuthenticated, function(req, res) {
    Tag.find({}, (err, tags) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.render('tags/index', {
            tags: tags
        });
    });
});

router.get('/create', userAuth.isAuthenticated, function(req, res) {
    res.render('tags/create');
});

router.get('/:id', userAuth.isAuthenticated, function(req, res) {
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
            return res.status(500).send();
        }
        res.render('tags/show', {
            tag: tag
        });
    });
});

// TODO: Only the creator may update the tag
router.get('/:id/update', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    Tag.findById(id, function(err, tag) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.render('tags/update', {
            tag: tag
        });
    });

});

router.post('/', userAuth.isAuthenticated, function(req, res) {
    var userId = req.user._id;
    var tag = new Tag({
        name: req.body.name,
        description: req.body.description,
        patternClass: req.body.patternClass,
        createdBy: req.user
    });

    tag.save(function(err) {
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
            _id: req.user._id
        }, {
            $set: {
                tags: req.user.tags
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            req.flash('success', 'Yeah! Your new tag was created.');
            return res.redirect('/users/' + req.user._id + '/tags');
        });
    });
});

// TODO: Only the creator may delete the tag
router.delete('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    Tag.findOneAndRemove({
        _id: id
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).render('error', {
                error: err
            });
        }
        req.flash('success', 'Your tag was deleted.');
        return res.redirect('/users/' + req.user._id + '/tags');
    });
});

// TODO: Only the creator may delete the tag
router.patch('/:id', userAuth.isAuthenticated, function(req, res) {
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
            return res.status(500).render('error', {
                error: err
            });
        }
        req.flash('success', 'Your tag was updated.');
        return res.redirect('/users/' + req.user._id + '/tags');
    });
});

module.exports = router;
