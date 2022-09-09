const Post = require('../models/post');
const Comment = require('../models/comment');

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
    });
}

// for deleting a perticular post form website
module.exports.destroy = function(req, res) {
    Post.findById(req.params.id, function(err, post){
        // .id means converting the object id (_id) into string
        if(post.user == req.user.id) {
            post.remove();
            
            Comment.deleteMany({
                post: req.params.id
            }, function(err) {
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }

    });
}