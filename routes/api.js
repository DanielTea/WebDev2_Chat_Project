const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../userAuth');

/**
 * AJAX route - INDEX
 * Get an array of all user objects in the database
 */
router.get('/users', userAuth.isAuthenticated, function(req, res) {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.json(users);
    });
});

module.exports = router;
