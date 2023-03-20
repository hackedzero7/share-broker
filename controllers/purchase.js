const { catchAsyncError } = require("../middleware/catchAsyncError");
const Purchase = require("../models/Purchase");
const Stock = require("../models/Stock");
const Wallet = require("../models/Wallet");
const ErrorHandler = require("../utils/errorHandler");
const axios = require('axios');
/**User buying the share controller */

exports.buyShare = catchAsyncError(async (req, res, next) => {
  const { quantity, price } = req.body;
  const { stockId , walletId } = req.query;
  const stock = await Stock.findById(stockId);
  if (!stock) {
    return next(new ErrorHandler("Stock not found", 404));
  }
  if (quantity > stock.noOfShares) {
    return next(new ErrorHandler("Not enough available shares", 400));
  }
  const { data: { rates } } = await axios.get('https://api.exchangerate.host/latest?base=USD&amount=1');
  const gbpRate = rates.GBP;
  const usdPrice = parseFloat(price.replace("$", "")) * quantity;
  const gbpPrice = (usdPrice * gbpRate).toFixed(2);

  const wallet = await Wallet.findById(walletId);
  if (!wallet) {
    return next(new ErrorHandler("Wallet not found", 404))
  }
  if (gbpPrice > wallet.balance) {
    return next(new ErrorHandler("Insufficient funds in wallet", 400));
  }
  const purchase = new Purchase({
    stock,
    user: req.user._id,
    quantity,
    totalPrice: gbpPrice
  });
  await purchase.save();
  stock.noOfShares -= quantity;
  await stock.save();

  wallet.balance -= gbpPrice;
  await wallet.save();

  res.status(200).json({
    success: true,
    message: 'Successfully buying shares',
  });
});



  /** user getting the details of buying shares */

exports.getAllPurchases = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const purchases = await Purchase.find({ user: userId }).populate('stock');
  
    res.status(200).json({
      success: true,
      purchases,
    });
  });


exports.getPurchaseDetails = catchAsyncError(async (req, res, next) => {
    // const { purchaseId } = req.params;
    // const userId = req.user._id;
  
    // const purchase = await Purchase.findOne({ _id: purchaseId, user: userId })
    const purchase = await Purchase.findById(req.params.id).populate('stock');
    if (!purchase) {
      return next(new ErrorHandler('Purchase not found', 404));
    }
  
    res.status(200).json({
      success: true,
      purchase,
    });
  });
  



  
  
  
  