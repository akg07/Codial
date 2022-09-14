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
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user');

            return res.status(200).json({
                data: {
                    newPost: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
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

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "post deleted Successfully"
                });
            }
            
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