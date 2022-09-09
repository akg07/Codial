const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const passport = require('passport');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);

router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/friends', userController.friends);

router.get('/sign-up', userController.signUp);

router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), userController.createSession);

router.get('/sign-out', userController.distroSession);

module.exports = router;