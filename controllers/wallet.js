const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const ErrorHandler = require("../utils/errorHandler");


/**user create the wallet controller */
exports.createWallet = catchAsyncError(async (req, res, next) => {
  // Check if user already has a wallet
  const user = await User.findById(req.user._id).select("+wallet");
  if (user.wallet) {
    return next(new ErrorHandler("You already have a wallet", 400));
  }

  // Create new wallet
  const wallet = new Wallet({
    user: req.user._id,
  });
  await wallet.save();

  // Link wallet to user
  user.wallet = wallet._id;
  await user.save();

  res.status(201).json({
    success: true,
    message: "Wallet created successfully",
    wallet,
  });
});

/**get user wallet detail controller */
exports.getUserWalletById = catchAsyncError(async (req, res, next) => {
    const wallet = await Wallet.findOne({ user: req.user._id }).populate('user', '-password');
    if(!wallet){
        return next(new ErrorHandler("Wallet not found", 404))
    }
    res.status(200).json({
        success: true,
        wallet
    })
})

