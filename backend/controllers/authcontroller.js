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
    const user = await User.create({
        name,
        email,
        password,
        passwordconfirm,
        phonenumber,
        avatar,});
        sendToken(user, 201, res);




    });