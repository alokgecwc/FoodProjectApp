// import required packages, files
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


// sigma

exports.signup = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, passwordconfirm, phonenumber } = req.body;

    let avatar = []
    // if avatar is provided, upload to cloudinary
    if (!req.body.avatar || req.body.avatar === "/images/images.png") {
        avatar = {
            public_id: "default",
            url: "/images/avatar.png",

        }
    } else {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
        })
          avatar = {
            public_id: result.public_id,
            url: result.secure_url,
            
            }
    }
    console.log("BODY:", req.body);
    const user = await User.create({
        name,
        email,
        password,
        passwordconfirm,
        phonenumber,
        avatar,});
        sendToken(user, 201, res);




    }
);

//Login
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    const isPasswordMatched = await user.correctPassword(password, user.password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }   

    sendToken(user, 200, res);
});

//Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
}                               
);

const jwt = require("jsonwebtoken");

exports.protect = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});
