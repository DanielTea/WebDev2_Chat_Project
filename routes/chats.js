const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const userAuth = require('../userAuth');

router.get('/', userAuth.isAuthenticated, function(req, res) {
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

router.post('/', userAuth.isAuthenticated, function(req, res) {
    var newChat = new Chat({
        name: req.body.name,
        users: req.body.users
    });

    newChat.save(function(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.send();
    });
});

router.get('/:id', userAuth.isAuthenticated, function(req, res) {
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

router.delete('/:id', userAuth.isAuthenticated, function(req, res) {
    Chat.findById(req.params.id, function(err, chat) {
        if (chat.users.indexOf(id) == -1) {
            return res.status(400).send('user is not part of this chat');
        }
        if (chat.users.length <= 1) {
            Chat.remove({
                _id: req.params.id
            }, function(err) {
                if (err) {
                    console.log(err);
                    return res.send('Database error');
                }
            });
        }
        var index = chat.users.indexOf(req.params.id);
        chat.users.splice(index, 1);
        chat.save(function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            return res.send();
        });
    });
});

module.exports = router;
