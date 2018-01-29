var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');
var Message = require('../models/message');
const userAuth = require('../userAuth');

router.get('/:id', userAuth.isAuthenticated, function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    try {
        Chat.find({ users: {$in: [id]}},

        (err, chats) => {
            if (err) console.log(err);
            res.render('chats/index', {
                chats: chats
            });
        });
    } catch (err) {
        throw console.log(err);
    }
});

/* GET home page. */
router.get('/create', userAuth.isAuthenticated, function(req, res) {
    res.render('createChat', {
        title: 'Create a Chat!'
    });
});

router.post('/', userAuth.isAuthenticated, function (req) {

    var newChat = new Chat({
        name : req.body.name,
        users :req.body.users,
        messages : req.body.messages
    });

    newChat.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

});

router.patch('/:id', userAuth.isAuthenticated, function(req, res){

    console.log(req.body);
    res.send("hi")

});


router.get('/:id', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Chat.findById(id, function (err, chat){
        res.send(chat)
    });

});

router.get('/single/:id/messages', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    var cChat = [];
    var cUser = [];
    var nMessages = [];

    Chat.find({}, function (err, chats) {
        for(var i in chats) {
            Chat.findById(chats[i]._id, function (err, chat) {
                User.findById(chat.users, function (err, user) {
                    if((user._id).equals(id)) {
                        cChat = chat;
                        cUser = user;
                        Message.findById(chat.messages, function (err, message) {
                            nMessages.push(message);
                            res.send(message);
                        });
                    }
                });
            });
        }
    });

    console.log(cChat);

    res.render('chats/show', {
        chat: cChat,
        user: cUser,
        messages: nMessages
    })

});

router.get('/group/:id/messages', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);


});

module.exports = router;
