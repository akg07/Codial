const express = require('express');
const router = express.Router();
const passport = require('passport');

// get post controller functions
const postController = require('../controllers/post_controller');

// All recent post view
router.get('/recient', postController.recient);
router.get('/feed', postController.feed);

// create a new post
router.post('/create', passport.checkAuthentication , postController.create);

module.exports = router;