"use strict";
const mongoose = require('mongoose');

const Driver = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: String,
    currBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('driver', Driver);

