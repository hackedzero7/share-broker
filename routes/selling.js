const express = require('express');
const { sellShare, getUserSellingDetails } = require('../controllers/selling');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
/**sell share route */
router.route('/sell').post(isAuthenticated, sellShare);
/**get user selling share detail route */
router.route('/setsellingdetails').get(isAuthenticated, getUserSellingDetails)

module.exports = router