var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/create', function (req, res) {
    res.render('createUser', {
        title: 'Create a User!'
    });
});

router.post('/', function (req) {
    var newProfile = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: new Date(req.body.birthDate),
        email: req.body.email,
        status: req.body.status
    });
    newProfile.password = newProfile.generateHash(req.body.password);

    newProfile.save(function (err, data) {
        if (err) {
            console.log(err);
        }
        console.log('Saved new user: ', data);
    });
});


router.get('/:id', function (req, res) {
    var objectId = require('mongodb').ObjectId;
    var id = new objectId(req.params.id);
    User.findById(id, function (err, profile) {
        res.render('users/show.ejs', {
            user: profile
        });
    });

});

module.exports = router;
