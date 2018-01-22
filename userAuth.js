var User = require('./models/user');
var functions = {};

functions.isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.flash('error', 'Please login to access this page.')
    return res.redirect('/login');
};

functions.isActiveUser = (req, res, next) => {
    functions.isAuthenticated(req, res, () => {
        if (req.user._id == req.params.id) {
            return next();
        }
        req.flash('error', 'You don\'t have permission to access this page.');
        return res.redirect('/');
    });
};

functions.isGuest = (req, res, next) => {
    if (!req.user) {
        return next();
    }
    req.flash('error', 'You are already signed up and logged in.');
    res.redirect('/');
};

module.exports = functions;
