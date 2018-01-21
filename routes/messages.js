var express = require('express');
var router = express.Router();
var Message = require('../models/message')


/* GET home page. */
router.get('/create', function(req, res) {
    res.render('createMessage', {
        title: 'Create a Message!'
    });
});

router.post('/', function (req) {

    var newMessage = new Message({
        multimedia : req.body.multimedia,
        content :req.body.content
    });

    newMessage.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

});

router.patch('/:id', function(req, res){

    console.log(req.body);
    res.send("hi")


});


router.get('/:id', function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Message.findById(id, function (err, message){
        res.send(message)
    });

});