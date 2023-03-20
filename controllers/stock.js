const { catchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require('cloudinary');
const Stock = require("../models/Stock");
const getDatAUri = require('../utils/dataUri');


/**create the stock controller for (admin) */

exports.createStock = catchAsyncError(async (req, res, next) => {
    const {name, ticker , noOfShares} = req.body;
    const file = req.file;
    if(!name || !ticker || !noOfShares || !file){
        return next(new ErrorHandler("Please Enter All Fields", 400))
    }
    
    const fileUri = getDatAUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

     await Stock.create({
        name, ticker, noOfShares, image:{public_id: mycloud.public_id, url: mycloud.secure_url}
    })
    res.status(201).json({
        success: true,
        message: 'Stock Created Successfully'
    })

})

/** get all stocks controller */
exports.getAllStock = catchAsyncError(async (req, res, next) => {
    const stocks = await Stock.find();
    res.status(200).json({
        success: true,
        stocks
    })
})

/**get the stock details by ID */
exports.getStockDetails = catchAsyncError(async (req, res, next) => {
    const stock = await Stock.findById(req.params.id);
    if(!stock){
        return next(new ErrorHandler("Stock not found", 404))
    }
    res.status(200).json({
        success: true,
        stock
    })
})

/**update stock controller for (admin) */
exports.updateStock = catchAsyncError(async (req, res, next) => {
    const {name, ticker, noOfShares} = req.body;
    const stock = await Stock.findById(req.params.id);
    if(name){
        stock.name = name;
    }
    if(ticker){
        stock.ticker = ticker;
    }
    if(noOfShares){
        stock.noOfShares = noOfShares;
    }

    // Check if file was uploaded
    if(req.file){
        const file = req.file;
        const fileUri = getDatAUri(file);
        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
        await cloudinary.v2.uploader.destroy(stock.image.public_id);
        stock.image = {
            public_id: mycloud.public_id,
            url:mycloud.secure_url
        }
    }

    await stock.save();
    res.status(200).json({
        success: true,
        message: 'Stock Updated Successfully'
    })
})

/** delete stock controller for (admin) */
exports.deleteStock = catchAsyncError(async (req, res, next) => {
    const stock = await Stock.findById(req.params.id);
  
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }
  
    // Delete the stock's image from Cloudinary
    await cloudinary.v2.uploader.destroy(stock.image.public_id);
  
    // Delete the stock from the database
    await stock.remove();
  
    res.status(200).json({
      success: true,
      message: 'Stock deleted successfully',
    });
  });
  