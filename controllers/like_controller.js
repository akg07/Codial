const Post= require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res) {
    try{

        // likes/toggle/?id=ablakd&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post') {
            // its a Post
            likeable = await Post.findById(req.query.id).populate('likes');
        }else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like is already already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id // we will put this req via authentication so user can be fetched from there
        });

        // If a like already exists delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            // create a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);

            likeable.save();
        }


        return res.status(200).json({
            message: 'request successfull',
            data: {
                deleted: deleted
            }
        })


    }catch(err){
        console.log('error at toggle Like method ', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

