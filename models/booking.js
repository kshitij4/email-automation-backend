const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    truckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    trailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
    startTime: Date,
    endTime: Date,
    totalMinutes: Number,
    status: {
        type: String,
        enum: ['pending', 'delivered'],
        default: 'pending'
    },
    photos: [{
        item: String,
        front: String,
        back: String,
        left: String,
        right: String,
        message: String,
    }],
    document: [{
        item: String,
        file: String,
        message: String
    }]
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
