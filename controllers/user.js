const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendToken");

/**registeration controller */
exports.register = catchAsyncError(async (req, res, next) => {
    const { firstName , lastName, userName , email, password, confirmPassword } = req.body;

    if(!firstName || !lastName || !userName || !email || !password || !confirmPassword){
        return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    if(password !== confirmPassword){
        return next(new ErrorHandler("Password does not match please confirm the password"))
    }

    let user = await User.findOne({ $or: [{ email }, { userName }] });
    if(user){
        return next(new ErrorHandler("User Already Exists", 409))
    }
    
    user = await User.create({
        firstName , lastName, userName , email, password
    })

    sendToken(res, user, "Regsteration Sucessfully", 201);
})


/**login controller */
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter All Field", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next(new ErrorHandler("Incorrect email or password", 401))
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return next(new ErrorHandler("Incorrect email or password", 401))
    }
    sendToken(res, user, `Welcome back ${user.name}`, 200)
})

/**logout controller */
exports.logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null , {
        expires: new Date(Date.now()),
        httpOnly: true, 
        secure: true, 
        sameSite: "none"
    }).json({
        success: true,
        message: "Logout Successfully"
    })
})

/**get user profile detail by id */
exports.getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user
    })
})


/** user update profile controller */
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const {firstName, lastName, userName, email} = req.body;
    const user = await User.findById(req.user._id);
    if(firstName){
        user.firstName = firstName;
    }
    if(lastName){
        user.lastName = lastName;
     }
     if(userName){
        user.userName = userName;
     }
    if(email){
        user.email = email;
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully"
    })

})