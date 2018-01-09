var express = require('express');
var router = express.Router();
var Chat = require('../models/chat')


/* GET home page. */
router.get('/create', function(req, res) {
    res.render('createChat', {
        title: 'Create a Chat!'
    });
});

router.post('/', function (req) {

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

router.patch('/:id', function(req, res){

    // var objectId = require('mongodb').ObjectId;
    // var id = new objectId(req.params.id);


    console.log(req.body);
    res.send("hi")
    // User.update(id, req.body)


});


router.get('/:id', function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Chat.findById(id, function (err, profile){
        res.send(profile)
    });

});

module.exports = router;
