const Post = require('../models/post');

module.exports.recient = function(req, res) {
    // return res.end('<h1>Recient Posts Sections</h1>')
    return res.render('Home', {
        title: "Recient Post Page"
    })
}

module.exports.feed = function(req, res) {
    return res.render('feed', {
        title: "My Feed"
    })
}

module.exports.create = function(req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err) {console.log('error in creating port'); return;}


        return res.redirect('back');
    })
}