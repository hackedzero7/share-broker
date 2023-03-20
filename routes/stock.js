const express = require('express');
const { createStock, getAllStock, updateStock, deleteStock, getStockDetails } = require('../controllers/stock');
const { isAuthenticated, autherizedAdmin } = require('../middleware/auth');
const singleUpload = require('../middleware/multer')
const router = express.Router();


/**create stock route and this is admin route  */
router.route('/createstock').post(isAuthenticated, autherizedAdmin, singleUpload, createStock);
/**get all stock route*/
router.route('/getallstocks').get(getAllStock);
/** get stock detail by id route*/
router.route('/stock/:id').get(getStockDetails);
/**update stock by id route and this is also admin route */
router.route('/stock/:id').put(isAuthenticated, autherizedAdmin, singleUpload, updateStock).delete(isAuthenticated, autherizedAdmin, singleUpload, deleteStock)

module.exports = router