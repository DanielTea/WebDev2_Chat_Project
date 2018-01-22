var express = require('express');
var router = express.Router();
var Message = require('../models/message');
const userAuth = require('../userAuth');


/* GET home page. */
router.get('/create', userAuth.isAuthenticated, function(req, res) {
    res.render('createMessage', {
        title: 'Create a Message!'
    });
});

router.post('/', userAuth.isAuthenticated, function (req) {

    var newMessage = new Message({
        multimedia : req.body.multimedia,
        content :req.body.content
    });

    newMultimedia.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

});

router.patch('/:id', userAuth.isAuthenticated, function(req, res){

    // var objectId = require('mongodb').ObjectId;
    // var id = new objectId(req.params.id);


    console.log(req.body);
    res.send("hi")
    // User.update(id, req.body)


});


router.get('/:id', userAuth.isAuthenticated, function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    Message.findById(id, function (err, profile){
        res.send(profile)
    });

});
