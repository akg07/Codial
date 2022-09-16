const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const passport = require('passport');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);

router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/friends', userController.friends);

router.get('/sign-up', userController.signUp);

router.get('/sign-in', userController.signIn);

router.get('/reset_page', userController.render_reset); // show reset password page

router.post('/generate_accessToken', userController.generateAccessToken); // create and send link for reset pass to uesr's email

router.get('/reset_key/:id', userController.verifyAccessToken); // verify access token and ask user about their new password

router.post('/change_pass', userController.changePassword); // change password

router.post('/create', userController.create);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), userController.createSession);

router.get('/sign-out', userController.distroSession);


router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);

module.exports = router;