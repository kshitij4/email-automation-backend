"use strict";
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;

