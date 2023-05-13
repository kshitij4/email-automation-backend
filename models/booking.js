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
    enum: ['pending','delivered'],
    defaultValue: 'pending'
  },
  photos: {
    front: String,
    back: String,
    left: String,
    right: String,
    message: String,
  },
  documents: {
    file: String,
    message: String
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
