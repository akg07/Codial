const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {

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
    // Type 1: using normal way
    /*
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts) {

        User.find({}, function(err, users){
            return res.render('home', {
                title: "Codial | Home",
                posts: posts,
                all_users: users
            });
        })

        
    });

    */

    // Type 2: Using promises

    // Type 3: Using asyn await

    try{
        //populate each user
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .populate({
            path: 'likes',
            populate: {
                path: 'user'
            }
        })
        .populate('likes'); // for posts like

        let users = await User.find({});

        return res.render('home', {
            posts: posts,
            all_users: users
        });
    }catch(err) {
        console.log('error', err);
    }
}

/*
module.exports.actionName = function(req, res) {
    // Put your actions here which you need to perform for this
    // perticular actionName
}

*/