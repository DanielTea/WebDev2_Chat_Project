var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/createUser', function (req, res) {

    var newUser = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        birthDate : new Date("01/26/2014 16" + ":00:00"),
        email : req.body.email,
        status : req.body.status,
        password : req.body.password
    });

    newUser.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

});

module.exports = router;
