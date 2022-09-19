const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env = require('./enviornment');

// Need to encrpt so we need a key

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = env.jwt_secert;

passport.use(new JwtStrategy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id, function(err, user){
        if(err) {
            console.log('error in finding user via jwt', err);
            return;
        }

        if(user) {
            return done(null, user)
        }else {
            return done(null, false);
        }
    });
}));

module.exports = passport;