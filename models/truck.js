const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    description: String,
    isBooked:{
        type: Boolean,
        default: false
    }
});

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;
