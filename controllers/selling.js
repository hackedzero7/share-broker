const { catchAsyncError } = require("../middleware/catchAsyncError");
const Purchase = require("../models/Purchase");
const Selling = require("../models/Selling");
const Stock = require("../models/Stock");
const Wallet = require("../models/Wallet");
const ErrorHandler = require("../utils/errorHandler");
const axios = require('axios')
/**user selling the buying shares */

exports.sellShare = catchAsyncError(async (req, res, next) => {
  const { quantity, price } = req.body;
  const { purchaseId, walletId } = req.query;
  
  const purchase = await Purchase.findById(purchaseId)
  .populate({
  path: "user",
  select: "name email",
  })
  .populate("stock");
  
  if (!purchase) {
  return next(new ErrorHandler("Purchase not found", 404));
  }
  
  if (purchase.user._id.toString() !== req.user._id.toString()) {
  return next(
  new ErrorHandler("You are not authorized to sell this share", 401)
  );
  }
  
  if (quantity > purchase.quantity) {
  return next(
  new ErrorHandler("You do not have enough shares to sell", 400)
  );
  }
  
  const { data: { rates } } = await axios.get('https://api.exchangerate.host/latest?base=USD&amount=1');
  const gbpRate = rates.GBP;
  const sellingPriceUSD = parseFloat(price.replace("$", ""));
  const sellingPriceGBP = (sellingPriceUSD * gbpRate).toFixed(2);
  const totalPrice = purchase.totalPrice - quantity * sellingPriceGBP;
  
  if (totalPrice < 0) {
  return next(new ErrorHandler("Invalid selling price", 400));
  }
  
  purchase.quantity -= quantity;
  purchase.totalPrice = totalPrice;
  
  if (purchase.quantity === 0) {
  await purchase.remove();
  } else {
  await purchase.save();
  }
  
  const stock = await Stock.findById(purchase.stock._id);
  
  if (!stock) {
  return next(new ErrorHandler("Stock not found", 404));
  }
  
  stock.noOfShares += quantity;
  await stock.save();
  
  const wallet = await Wallet.findById(walletId);
  
  if (!wallet) {
  return next(new ErrorHandler("Wallet not found", 404));
  }
  
  const sellingPriceUSDTotal = quantity * sellingPriceUSD;
  const sellingPriceGBPTotal = (sellingPriceUSDTotal * gbpRate).toFixed(2);
  wallet.balance += parseFloat(sellingPriceGBPTotal);
  await wallet.save();
  
  const selling = new Selling({
  stock: purchase.stock,
  user: req.user._id,
  quantity,
  totalPrice: sellingPriceGBPTotal,
  });
  
  await selling.save();
  
  res.status(200).json({
  success: true,
  message: "Share sold successfully",
  });
  });
  

/** user getting the details of selling the shares */

exports.getUserSellingDetails = catchAsyncError(async (req, res, next) => {
    const selling = await Selling.find({ user: req.user._id }).populate('stock');
    if (!selling) {
      return next(new ErrorHandler('No selling details found', 404));
    }
    res.status(200).json({
      success: true,
      selling,
    });
  });