const express = require('express');
const router = express.Router();
const userAuth = require('../userAuth');
const User = require('../models/user');
const Tag = require('../models/tag');
const Chat = require('../models/chat');

/**
 * EJS route
 * Renders the home page
 */
router.get('/', userAuth.isAuthenticated, function (req, res) {
    res.render('index', {
        title: process.env.SITE_TITLE
    });
});

/**
 * EJS route
 * Built with a simple RegEx search in the database
 * We search for users and tags
 */
router.get('/search', userAuth.isAuthenticated, (req, res) => {
    var searchQuery = req.query.q;
    User.find({
        $or: [{
            firstName: new RegExp(searchQuery, 'i')
        }, {
            lastName: new RegExp(searchQuery, 'i')
        }]
    }, (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        Tag.find({
            $or: [{
                name: new RegExp(searchQuery, 'i')
            }, {
                description: new RegExp(searchQuery, 'i')
            }]
        }, (err, tags) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            res.render('search', {
                searchQuery: searchQuery,
                users: users,
                tags: tags
            });
        });
    });
});

module.exports = router;
