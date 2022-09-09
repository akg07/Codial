const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res) {
    Post.findById(req.body.post, function(err, post) {
        // TODO handle err
        if(err) {
            console.log('err at finding the post');
            return;
        }

        if(post) {
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment) {
                // TODO handle err
                if(err) {
                    console.log('err at adding the comment');
                    return;
                }

                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            });
        }
    });
}