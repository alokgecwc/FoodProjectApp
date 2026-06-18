// schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const vaildator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { availableMemory } = require('process');

// create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [vaildator.isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password should be greater than 6 characters'],
        select: false,
    },
    passowardconfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        vaalidate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match',
        },
    },
    phonenumber: {
        type: String,
        required: [true, 'Please enter your phone number'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],  
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: {
        public_id: String,
        url: String,
            
    },
    passwordresetToken: String,
    passwordresetExpire: Date,
    passwordChangedAt: Date,
},
{timestamps: true}
);

// hash password
// pre(save) => run before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
    this.passowardconfirm = undefined
});

// pass compare

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

// check weather the user's pass changed after getting jwt token
// if yes, the old password is not valid, so user need to login again

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false;

}   

// custom method to generate jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

module.exports = mongoose.model('User', userSchema);


