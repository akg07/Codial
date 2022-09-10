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

            req.flash('success', 'Comment added successfully');
            return res.redirect('/');
        }
    }catch(err){

        req.flash('error', err);
        return res.redirect('/');
    }
}

module.exports.destroy = async function(req, res) {

    try{
        let comment = await Comment.findById(req.params.id);

        // comment user and logged in user should be same
        if(comment.user == req.user.id) {

            let post_id = comment.post;
            Comment.remove();

            let post = await Post.findByIdAndUpdate(post_id, {
                $pull: {
                    comments: req.params.id
                }
            });

            req.flash('success', 'Comment deleted');
            return res.redirect('back');
        }else {
            req.flash('error', 'Unauthorized: Denied');
            return res.redirect('back');
        }
    }catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
    
}