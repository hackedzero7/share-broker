const { catchAsyncError } = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");


/**function realted to user is authenticated or not for protecting route */
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login First"), 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
})

/**function for admin access protecting routes */

exports.autherizedAdmin = (req, res, next) => {
    if(req.user.role !== "admin"){
        return next(new ErrorHandler(`${req.user.role} is not allow to access this resource.`))
    }
    next();
}