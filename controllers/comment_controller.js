const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try{
        let post = await Post.findById(req.body.post);
    
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            return res.redirect('/');
        }
    }catch(err){
        console.log('error', err);
        return;
    }
}

module.exports.destroy = function(req, res) {

    Comment.findById(req.params.id, function(err, comment) {

        // comment user and logged in user should be same
        if(comment.user == req.user.id) {

            let post_id = comment.post;
            Comment.remove();

            Post.findByIdAndUpdate(post_id, {
                $pull: {
                    comments: req.params.id
                }
            }, function(err, post) {

                return res.redirect('back');
            });
        }else {
            return res.redirect('back');
        }
    });
}