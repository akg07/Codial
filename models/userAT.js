const mongoose = require('mongoose');

const userWithAccessToken = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const UserAT = mongoose.model('UserAT', userWithAccessToken);
module.exports = UserAT