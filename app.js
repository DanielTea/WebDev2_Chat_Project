var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override')

var passport = require('passport');
var LocalStrategy = LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_MONGO_URI, {
    useMongoClient: true
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
var secure_cookie = process.env.HTTPS_SECURED == 'true';
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

const User = require('./models/user');
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

app.use((req, res, next) => {
  app.locals.activeUser = req.user;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/development', require('./routes/development'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
