const express = require('express');
const router = express.Router();

// home controller for router
const homeController = require('../controllers/home_controller');

console.log('router loaded');


router.get('/', homeController.home);
router.get('/user', homeController.user);

module.exports = router;