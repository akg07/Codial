const Post = require('../models/post');

module.exports.home = function(req, res) {

    // console.log(req.cookies);

    // return res.end('<h1>Express is up for Codial!!</h1>')
    
    // w/o fetching user details
    /*
    Post.find({}, function(err, posts) {
        return res.render('home', {
            title: "Codial | Home",
            posts: posts
        });
    });
    */

    // with fetching users details -> populate the user of each posts
    Post.find({}).populate('user').exec(function(err, posts) {
        return res.render('home', {
            title: "Codial | Home",
            posts: posts
        });
    });


}

/*
module.exports.actionName = function(req, res) {
    // Put your actions here which you need to perform for this
    // perticular actionName
}

*/