const express = require('express');
const router = express.Router();
const passport = require('passport');
const userAuth = require('../userAuth');
const User = require('../models/user');
const Tag = require('../models/tag');
const Chat = require('../models/chat');

// TODO
router.get('/', userAuth.isAuthenticated, function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

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
            Chat.find({
                name: new RegExp(searchQuery, 'i'),
                users: {
                    $in: [req.user._id]
                }
            }, (err, chats) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Database error');
                }
                res.render('search', {
                    searchQuery: searchQuery,
                    users: users,
                    tags: tags,
                    chats: chats
                });
            });
        });
    });
});

module.exports = router;
