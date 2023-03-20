const express = require('express');
const { buyShare, getAllPurchases, getPurchaseDetails } = require('../controllers/purchase');
const { isAuthenticated } = require('../middleware/auth');

const router = express();
/**buying share route */
router.route('/purchase').post(isAuthenticated, buyShare);
/**get all buying share detail route */
router.route('/user/purchase').get(isAuthenticated, getAllPurchases);

router.route('/purchase/:id').get(getPurchaseDetails);



module.exports =  router;