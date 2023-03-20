const express = require('express');
const { register, login, logout, getMyProfile, updateProfile } = require('../controllers/user');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

/**registeration route */
router.route('/register').post(register);

/**login route */
router.route('/login').post(login);

/**get profile detail route */
router.route('/me').get(isAuthenticated, getMyProfile);

/** update profile route */
router.route('/updateprofile').put(isAuthenticated, updateProfile);

/**logout user route */
router.route('/logout').get(logout);


module.exports = router;