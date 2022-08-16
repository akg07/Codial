const express = require('express');
const router = express.Router();

// get post controller functions
const postController = require('../controllers/post_controller');

// All recent post view
router.get('/recient', postController.recient);
router.get('/feed', postController.feed);

module.exports = router;