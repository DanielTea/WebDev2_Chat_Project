var express = require('express');
var router = express.Router();
var User = require('../models/user')


/* GET home page. */
router.get('/create', function(req, res) {
    res.render('createUser', {
        title: 'Create a User!'
    });
});

router.post('/', function (req) {

    var newProfile = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        birthDate : new Date(req.body.birthDate),
        email : req.body.email,
        status : req.body.status,
        password : req.body.password
    });

    newProfile.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

});


router.post('/getProfile', function (req, res) {
    var objectId = require('mongodb').ObjectId;
    console.log(req.body.id);

    var id = new objectId(req.body.id);
    User.findById(id, function (err, profile){
        console.log('%s %s has %s as e-mail.', profile.firstName, profile.lastName, profile.email);
        res.send(profile)
    });

});

module.exports = router;
