var express = require('express');
var router = express.Router();
var passport = require('passport');
const userAuth = require('../userAuth');

/* GET home page. */
router.get('/', userAuth.isAuthenticated, function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/search', userAuth.isAuthenticated, (req, res) => {
    // TODO: Actually search stuff
    res.render('search', {
        searchQuery: req.query.q
    });
});

module.exports = router;
