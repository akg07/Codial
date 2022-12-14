const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


// login via jwt
module.exports.createSession = async function(req, res) {
    
    try{
        let user = await User.findOne({
            email: req.body.email
        });

        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "invalid username/password"
            });
        }

        return res.status(200).json({
            message: "signed in successfully",
            data: {
                token: jwt.sign(user.toJSON(), 'codial', {expiresIn: '100000'})
            }
        });
    }
    catch(err){
        console.log("************", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }

}