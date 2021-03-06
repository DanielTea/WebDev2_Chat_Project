const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const app = express();

/**
 * Method override for the different standards (URL parameter or HTTP header field)
 */
app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM

/**
 * Mongoose setup
 */
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_MONGO_URI, {
    useMongoClient: true
});

/**
 * Remove trailing slash from urls
 */
app.use(function (req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
        return res.redirect(301, req.url.slice(0, -1));
    }
    return next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
const secure_cookie = process.env.HTTPS_SECURED == 'true';
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: secure_cookie
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

/**
 * User authentification using [Passport.JS](http://www.passportjs.org/)
 */
passport.use(new LocalStrategy({
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({
            email: email
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('user does not exist');
                return done(null, false, req.flash('error', 'Sorry, email/password combination was invalid.'));
            }
            if (!user.validatePassword(password)) {
                console.log('password is not correct.');
                return done(null, false, req.flash('error', 'Sorry, email/password combination was invalid.'));
            }
            console.log('login successful.');
            return done(null, user, req.flash('success', 'Yeah! You got logged in.'));
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/**
 * Populate local variables that may be used in any EJS template
 */
app.use((req, res, next) => {
    app.locals.siteTitle = process.env.SITE_TITLE;
    app.locals.activeUser = req.user;
    app.locals.flashError = req.flash('error');
    app.locals.flashSuccess = req.flash('success');
    app.locals.currentUri = req.originalUrl;

    const epochs = [
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1]
    ];

    const getDuration = (timeAgoInSeconds) => {
        for (let [name, seconds] of epochs) {
            const interval = Math.floor(timeAgoInSeconds / seconds);
            if (interval >= 1) {
                return {
                    interval: interval,
                    epoch: name
                };
            }
        }
    };
    app.locals.timeAgo = (date) => {
        const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
        const {
            interval,
            epoch
        } = getDuration(timeAgoInSeconds);
        const suffix = interval === 1 ? '' : 's';

        return `${interval} ${epoch}${suffix} ago`;
    };

    next();
});

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Sass middleware for live compiling of scss to css
 */
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));

/**
 * Serving static files like css and client-side javascript
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Bind all routes to their entry point urls
 */
app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/tags', require('./routes/tags'));
app.use('/chats', require('./routes/chats'));
app.use('/api', require('./routes/api'));
app.use('/development', require('./routes/development'));

/**
 * Catch 404 and forward to error handler
 */
app.use((req, res) => {
    res.render('404');
});

/**
 * Error handler
 */
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
