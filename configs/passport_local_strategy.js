const passport = require('passport');
const User = require('../models/user');
const env = require('./enviornment');

const LocalStrategy = require('passport-local').Strategy;


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        // find the user and establish the identity
        User.findOne({email: email}, function(err, user) {
            if(err) {
                req.flash('error', 'Error in finding the user');
                // console.log('err in finding user');
                return done(err);
            }

            if(!user || user.password != password) {
                req.flash('error' , 'Invalid Username/Password');
                return done(null, false);
            }

            // req.flash('success', 'Wellcome ' + user.name);
            return done(null, user);
        });
    }
));

//serializing  the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log('err in finding user');
            return done(err);
        }

        return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // if the user is signed In, then pass on the request to next function(controller's action);
    if(req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    // set enviornment name along with codial
    res.locals.env_name = env.name;

    if(req.isAuthenticated()) {
        // req.user contains the current signed user from the session cookie and we are just sending this to locals for views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;