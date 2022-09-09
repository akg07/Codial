const User = require('../models/user');

module.exports.profile = function(req, res) {

    User.findById(req.params.id, function(err, user){
        return res.render('user', {
            title: "User Profile",
            profile_user: user
        })
    });

    // return res.end('<h1>Users Profile</h1>');
    
}

module.exports.update = function(req, res){

    if(req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            // alert('Profile Udpated');
            return res.redirect('/');
        });
    }else {
        return res.status(401).send('Unauthorized');
    }
}

module.exports.friends = function(req, res) {

    // return res.end('<h1>All My Friends List</h1>')
    return res.render('user', {
        title: "Friends"
    })
}

// render the sign up page
module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'Codial | Sign Up'
    });
}

// render the sign in page
module.exports.signIn = function(req, res) {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: 'Codial | Sign In'
    });
}

// get the sign up data
module.exports.create = function(req, res) {
    
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {console.log('error in finding user in signing up'); return; }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) {console.log('error in finding user in signing up'); return; }

                return res.redirect('/users/sign-in');
            });
        } else {
            return res.redirect('back');
        }


    });

}

// sign in and create a session for user
module.exports.createSession = function(req, res) {
    
    return res.redirect('/'); // redirect user to home
}

module.exports.distroSession = function(req, res) {
    // this function is given to req by passport.js
    req.logout(function(err) {
        if(err) {
            console.log(err || 'Logged out from session');
        }
        return res.redirect('/'); // redirect user to home
    }); 

}