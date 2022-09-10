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

module.exports.create = async function(req, res) {
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        req.flash('success', 'Post Published');
        return res.redirect('back');
    }catch(err){
        req.flash('error', 'error');
        return res.redirect('back');
    }

}

// for deleting a perticular post form website
module.exports.destroy = async function(req, res) {
    try{
        let post = await Post.findById(req.params.id);
    
        // .id means converting the object id (_id) into string
        if(post.user == req.user.id) {
            post.remove();
            
            await Comment.deleteMany({
                post: req.params.id
            });
            
            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
        }else{
            req.flash('error', 'You can not delete this post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', 'error');
        return res.redirect('back');
    }
}