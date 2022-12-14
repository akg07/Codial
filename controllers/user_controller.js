const User = require('../models/user');

// for reset pass
const UserAT = require('../models/userAT');
const crypto = require('crypto');
const resetPassMailer = require('../mailers/reset_pass_mailer');
const queue = require('../configs/kue');
const resetPassWorker = require('../workers/reset_pass_email_worker');

// for dp upload
const fs = require('fs'); // file-system
const path = require('path');
const { render } = require('ejs');

module.exports.profile = function(req, res) {

    User.findById(req.params.id, function(err, user){
        return res.render('user', {
            title: "User Profile",
            profile_user: user
        })
    });

    // return res.end('<h1>Users Profile</h1>');
    
}

// upadte the current user
module.exports.update = async function(req, res){

    /*
    if(req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            // alert('Profile Udpated');
            req.flash('success', 'Profile updated successfully');
            return res.redirect('/');
        });
    }else {
        req.flash('error', 'Unauthorized: Access Denied')
        return res.status(401).send('Unauthorized');
    }
    */

    if(req.user.id == req.params.id) {
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('Multer error', err);
                }

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    // edge case: replace the previous avatar with new one
                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar)); // deletes the file
                    }

                    // saving the path of the uploaded file into the avatar field into user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();

                req.flash('success', "Profile updated");
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else {
        req.flash('error', 'Unauthorized: Access Denied')
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
        req.flash('success', 'Welcome to Codial!!!');
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
    req.flash('success', 'Wellcome Back!! ' + req.user.name);
    return res.redirect('/'); // redirect user to home
}

module.exports.distroSession = function(req, res) {
    // this function is given to req by passport.js
    req.logout(function(err) {
        if(err) {
            console.log(err || 'Logged out from session');
        }
        req.flash('success', 'See you soon :-)');
        return res.redirect('/'); // redirect user to home
    }); 

}

module.exports.render_reset = function(req, res) {
    
    return res.render('reset_page');
}

module.exports.generateAccessToken = async function(req, res) {
    try{
        let user = await User.findOne({email: req.body.email});

        if(user){
            // create user with accessToken
            let userWithAT = await UserAT.create({
                user: user,
                email: user.email,
                name: user.name,
                accessToken: crypto.randomBytes(20).toString('hex')
            });
        
            // populate userAT with users fields
            userWithAT = await userWithAT.populate('user', 'name email');

            // add user with access token to mailer worker
            let job = queue.create('resetPassEmails', userWithAT).save();
            console.log('Job Enqueued');
        }
        return res.render('reset_pass_message');

    }catch(err){
        console.log('error: Processing reset password request ', err)
    }
}

module.exports.verifyAccessToken = async function(req, res) {

    let userWithAT = await UserAT.findOne({accessToken: req.params.id});

    // if link is invalid
    if(!userWithAT) {
        return res.render('invalid', {
            message: 'invalid Link'
        });
    }

    // if token is invalid
    if(! userWithAT.isValid) {
        return res.render('invalid', {
            message: 'Link Expired'
        });
    }

    let userId = userWithAT.user;

    let user = await User.findById(userId);
    
    if(user){
        await UserAT.findOneAndUpdate({accessToken: req.params.id}, {isValid: false});
        return res.render('new_password', {
            user: user
        });
    }


    return res.render('invalid', {
        message: 'Invalid User'
    });
}

module.exports.changePassword = async function(req, res) {

    console.log(req.body.email + " " + req.body.password + " " + req.body.confirm_password);

    if(req.body.password == req.body.confirm_password) {
        let user = await User.findOneAndUpdate(
            {email: req.body.email},
            {password: req.body.password});
        
            if(user) {
                return res.render('user_sign_in');
            }
        
    }
    
    
    return res.render('invalid', {
        message: "password and confirm password doesn't match"
    });
}