var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcryptjs');


router.get('/', function(req, res) {
    try {
        User.find({}, (err, users) => {
            if (err) console.log(err);
            res.render('users/index', { users: users, req: req });
        });
    } catch (err) {
        throw err;
    }
});

router.get('/create', function(req, res) {
    res.render('users/create', {
        req: req
    });
});

router.post('/', function(req) {
    var newProfile = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: new Date(req.body.birthDate),
        email: req.body.email,
        status: req.body.status
    });
    newProfile.password = newProfile.generateHash(req.body.password);

    newProfile.save(function(err, data) {
        if (err) {
            console.log(err);
        }
        console.log('Saved new user: ', data);
        res.send('registered');
    });
});

router.patch('/:id', function(req, res) {

    // var objectId = require('mongodb').ObjectId;
    // var id = new objectId(req.params.id);


    console.log(req.body);
    res.send("hi")
    // User.update(id, req.body)


});


router.get('/:id', function(req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    User.findById(id, function(err, user) {
        res.render('users/show.ejs', {
            user: user
        });
    });

});

module.exports = router;
