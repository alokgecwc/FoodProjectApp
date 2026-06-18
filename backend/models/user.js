// schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const vaildator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
