const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../userAuth');

router.get('/users', userAuth.isAuthenticated, function(req, res) {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(users);
    });
});

module.exports = router;
