var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        user: req.user,
        error: req.flash('error'),
        success: req.flash('success')
    });
});

/*
 *  Temporary test routes for development
 */

router.get('/purge-collections', (req, res) => {
    const User = require('../models/user');
    User.collection.remove((err) => {
        if (err) {
            res.send(err);
        }
        res.send('all good');
    });
});

module.exports = router;
