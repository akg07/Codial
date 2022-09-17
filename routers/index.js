const express = require('express');
const router = express.Router();

// home controller for router
const homeController = require('../controllers/home_controller');

console.log('router loaded');


router.get('/', homeController.home);

// router for users
router.use('/users', require('./users'));

// routers for post
router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));

router.use('/likes', require('./likes'));

router.use('/api', require('./api'));

// 404 not found page
router.get('*', function(req, res) {
    return res.render('404');
})



/*
    for any further routes, access from here
    router.use('/routerName', require('./routerFile'));
*/

module.exports = router;