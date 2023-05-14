const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
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
},{
    timestamps: true
});

const Trailer = mongoose.model('Trailer', trailerSchema);

module.exports = Trailer;
