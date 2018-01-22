/**
 * Created by danieltremer on 12/31/17.
 */
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Tag = require('../models/tag');

router.get('/', function(req, res) {
    try {
        Tag.find({}, (err, tags) => {
            if (err) console.log(err);
            res.render('tags/index', {
                tags: tags
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

        Tag.findById(id, function(err, tag) {
            res.render('tags/update', {
                tag: tag
            });
        });

    } catch (err) {
        throw err;
    }
});

router.get('/:id/messages', function(req, res) {
    try {
        var objectId = require('mongodb').ObjectId;
        var id = new objectId(req.params.id);

        Tag.findById(id, function(err, tag) {

            console.log(tag.messages)
            res.send({
                messages: tag.messages
            });
        });

    } catch (err) {
        throw err;
    }
});

router.get('/create', function(req, res) {
    res.render('tags/create');
});

router.post('/', function(req, res) {
    console.log("irgendeinen scheiß halt");
    if (req.tag) {
        req.flash('error', 'This tag already exists.');
        return res.status(400).redirect('/tags/create');
    }

    var tag = new Tag({
        name: req.body.name,
        description: req.body.description
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
            req.flash('success', 'Yeah! New created tag now.');
            return res.redirect('/tags');
        });
});

router.delete('/:id', function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    Tag.findOneAndRemove({
        _id:id
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).render('error', {
                error: err
            });
        }
        return res.redirect('/tags/');
    });

});

router.patch('/:id', function(req, res) {
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
        return res.redirect('/tags/');
    });
});

module.exports = router;