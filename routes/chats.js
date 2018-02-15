var express = require('express');
var Q = require('q');
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');
var Message = require('../models/message');
const userAuth = require('../userAuth');

router.get('/', userAuth.isAuthenticated, function(req, res) {
    Chat.find({
        users: {
            $in: [req.user._id]
        }
    }, (err, chats) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
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
            return res.status(500).send();
        }
        res.send();
    });

});

// TODO write code or remove
// router.patch('/:id', userAuth.isAuthenticated, function(req, res) {
//     console.log(req.body);
//     res.send("hi");
// });

router.get('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Chat.findById(id)
        .populate({
            path: 'messages',
            populate: {
                path: 'user'
            }
        })
        .exec((err, chat) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            res.send(chat);
        });

});

router.delete('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Chat.findById(id, function(err, chat) {
        if (chat.users.indexOf(id) == -1) {
            // user is not part of this chat
            return res.status(400).send();
        }
        if (chat.users.length <= 1) {
            Chat.remove({
                _id: id
            }, function(err) {
                if (err) {
                    console.log(err);
                    return res.send();
                }
            });
        }
        var index = chat.users.indexOf(id);
        chat.users.splice(index, 1);
        chat.save(function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            return res.send();
        });
    });
});

module.exports = router;
