var express = require('express');
var router = express.Router();
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

router.get('/:id/messages', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);

    var nMessages = [];

    Chat.findById(id, function (err, chat) {
        Message.findById(chat.messages, function (err, message){
            nMessages.push(message);
            res.render('chats/show', {
                chat: chat,
                messages: nMessages
            });
        });
    });



});

module.exports = router;
