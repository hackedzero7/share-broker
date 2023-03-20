const express = require('express');
const { createWallet, getUserWalletById } = require('../controllers/wallet');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();


/**create wallet route */
router.route('/createwallet').post(isAuthenticated, createWallet);

/**get the wallet detail route */
router.route('/wallet').get(isAuthenticated, getUserWalletById)

module.exports = router;