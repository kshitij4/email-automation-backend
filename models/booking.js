const mongoose = require('mongoose');

const itemData = {
    status: {
        type: String,
        enum: ['pending', 'delivered'],
        default: 'pending'
    },
    photos: {
        front: String,
        back: String,
        left: String,
        right: String,
        message: String,
    },
    document: {
        file: String,
        message: String
    }
}

const bookingSchema = new mongoose.Schema({
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
    truck: {
        truckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
        ...itemData
    },
    trailer: {
        trailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
        ...itemData
    },
    returnTrailer: {
        trailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
        ...itemData
    },
    startTime: Date,
    endTime: Date,
    totalSeconds: Number,
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
