const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const userAuth = require('../userAuth');

/**
 * EJS route - INDEX
 * Render an index page of all chats,
 * this page uses AJAX Requests (via jQuery) to load all messages of the currently open chat.
 */
router.get('/', userAuth.isAuthenticated, function (req, res) {
    Chat.find({
        users: {
            $in: [req.user._id]
        }
    }, (err, chats) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('chats/index', {
            chats: chats
        });
    });
});

/**
 * AJAX route - STORE
 * Inserts a new chat into the database, called via AJAX
 */
router.post('/', userAuth.isAuthenticated, function (req, res) {
    const newChat = new Chat({
        name: req.body.name,
        users: req.body.users
    });

    newChat.save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.send();
    });
});

/**
 * AJAX route - SHOW
 * Gets the corresponding chat object including all populated messages
 */
router.get('/:id', userAuth.isAuthenticated, function (req, res) {
    Chat.findById(req.params.id)
        .populate({
            path: 'messages',
            populate: {
                path: 'user'
            }
        })
        .exec((err, chat) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            res.send(chat);
        });
});

module.exports = router;
