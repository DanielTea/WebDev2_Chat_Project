/**
 * Created by danieltremer on 12/31/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('newUser', {
        title: 'Create a User!'
    });
});

module.exports = router;